const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, getVoiceConnection } = require('@discordjs/voice')
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDb, runDb, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');
const ytdl = require('ytdl-core');
const {youtube} = require('../../youtube-system/youtubeApi');

// FUNZIONI DA GESTORE
async function playSong(interaction, query, customEmoji, language_result) {
	const voiceChannel = await interaction.guild.channels.fetch(interaction.member.voice.channelId);
	// SE NON CI SONO DATI IN RIPRODUZIONE VIENE INSTANZIATA UNA CONNESSIONE E AVVIATA LA RIPRODUZIONE DI UN URL
	const player = createAudioPlayer();
	await eventPlayer(player, interaction.channel, query, interaction.guild.id);
	const connection = joinVoiceChannel({
		channelId: interaction.member.voice.channelId,
		guildId: interaction.guild.id,
		adapterCreator: voiceChannel.guild.voiceAdapterCreator
	}).subscribe(player);

	const stream = ytdl(query, { filter: 'audioonly' });

	player.play(createAudioResource(stream))
	if(query.includes("list")) {
		const playlistId = query.split("list=")[1].split("&")[0];
		const playlist = await youtube.playlistItems.list({
			part: "contentDetails",
			playlistId: playlistId,
			maxResults: 50
		});
		for await (const value of playlist.data.items) {
			query = `https://www.youtube.com/watch?v=${value.contentDetails.videoId}`
			await runDb("INSERT INTO music_queue_system (guildId, voiceChannelId, url) VALUES (?, ?, ?)", interaction.guild.id, interaction.member.voice.channelId, query);
		}
	} else {
		await runDb("INSERT INTO music_queue_system (guildId, voiceChannelId, url) VALUES (?, ?, ?)", interaction.guild.id, voiceChannel.id, query);
	}

	const embedLog = new EmbedBuilder()
		.setAuthor({ name: `${language_result.ready.embed_title}`, iconURL: customEmoji })
		.setDescription(language_result.ready.description)
		.setFooter({ text: `${language_result.ready.embed_footer}`, iconURL: `${language_result.ready.embed_icon_url}` })
		.setColor(0x3d4c52);
	await interaction.reply({ embeds: [embedLog] });
}
async function playMessage(query, customEmoji, language_result, channel) {
	const videoInfo = await ytdl.getInfo(query);

	let checkDatabase = await readDbAllWith1Params("SELECT * FROM music_queue_system WHERE guildId = ?", channel.guild.id);

	const embedLog = new EmbedBuilder()
		.setAuthor({ name: `${language_result.playing.embed_title}`, iconURL: customEmoji })
		.setDescription(language_result.playing.description)
		.setFooter({ text: `${language_result.playing.embed_footer}`, iconURL: `${language_result.playing.embed_icon_url}` })
		.setFields([
			{ name: language_result.playing.songTitle, value: `${videoInfo.player_response.videoDetails.title}` },
			{ name: `${language_result.playing.queueSlot} (${checkDatabase.length})`, value: ` ` }
		])
		.setColor(0x09475c);
	await channel.send({ embeds: [embedLog] });
}

async function queueEnd(query, customEmoji, language_result, channel) {
	const videoInfo = await ytdl.getInfo(query);

	const embedLog = new EmbedBuilder()
		.setAuthor({ name: `${language_result.queueEnd.embed_title}`, iconURL: customEmoji })
		.setDescription(language_result.queueEnd.description)
		.setFooter({ text: `${language_result.queueEnd.embed_footer}`, iconURL: `${language_result.queueEnd.embed_icon_url}` })
		.setColor(0x09185e);
	await channel.send({ embeds: [embedLog] });
}


async function eventPlayer(player = "AudioPlayer", channel = "TextChannel", query = "Song", guild = "Guild Id") {
	let customEmoji = await getEmojifromUrl(channel.client, "musicBot");
	// RECUPERO LA LINGUA
	let data = await language.databaseCheck(guild);
	const langagues_path = readFileSync(`./languages/music-system/${data}.json`);
	const language_result = JSON.parse(langagues_path);
	player.on('error', (error) => {
		console.log(error);
	})

	player.on('stateChange', async (oldState, newState) => {
		if (newState.status == "playing") {
			await playMessage(query, customEmoji, language_result, channel);

		}
		if (newState.status == "idle") {
			// CONTROLLO IL DATABASE E LI SORTEGGIO TRAMITE ID
			let checkDatabase = await readDbAllWith1Params('SELECT * FROM music_queue_system WHERE guildId = ? ORDER BY ID', guild);
			if (checkDatabase.length > 1) {
				query = checkDatabase[1].url;
				const stream = ytdl(query, { filter: 'audioonly', highWaterMark: 50000, dlChunkSize: 0 });
				await runDb('DELETE FROM music_queue_system WHERE ID = ?', checkDatabase[0].ID);

				player.play(createAudioResource(stream));
			} else {
				getVoiceConnection(guild).disconnect();
				await queueEnd(query, customEmoji, language_result, channel);
				await runDb('DELETE FROM music_queue_system WHERE guildId = ?', guild);
			}

		}
	})
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Use this command to play a music on channel')
		.addStringOption(option =>
			option
				.setName('query')
				.setDescription('URL to play')
				.setRequired(true)
		),
	async execute(interaction) {
		let query;
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'query') query = value.value;
		});
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/music-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);

		try {
			let customEmoji = await getEmojifromUrl(interaction.client, "musicBot");
			// CONTROLLO SE IL LINK è VALIDO SU YOUTUBE
			if (ytdl.validateURL(query)) {
				// CONTROLLO SE IL COMANDO VIENE ESEGUITO DENTRO UN CANALE VOCALE
				if (interaction.member.voice.channelId) {
					// CONTROLLO IL DATABASE PER VISUALIZZARNE I DATI
					let checkDatabase = await readDbAllWith1Params("SELECT * FROM music_queue_system WHERE guildId = ?", interaction.guild.id);

					// CONTROLLO SE IL DATABASE HA GIA' DEI DATI IN RIPRODUZIONE
					if (checkDatabase.length != 0) {
						if (checkDatabase[0].voiceChannelId == interaction.member.voice.channelId) {
							if (getVoiceConnection(interaction.guild.id)?.state.status == "ready") {
								if(query.includes("list")) {
									const playlistId = query.split("list=")[1].split("&")[0];
									const playlist = await youtube.playlistItems.list({
										part: "contentDetails",
										playlistId: playlistId,
										maxResults: 50
									});
									for await (const value of playlist.data.items) {
										query = `https://www.youtube.com/watch?v=${value.contentDetails.videoId}`
										await runDb("INSERT INTO music_queue_system (guildId, voiceChannelId, url) VALUES (?, ?, ?)", interaction.guild.id, interaction.member.voice.channelId, query);
									}
								} else {
									await runDb("INSERT INTO music_queue_system (guildId, voiceChannelId, url) VALUES (?, ?, ?)", interaction.guild.id, interaction.member.voice.channelId, query);
								}
							} else {
								await runDb('DELETE FROM music_queue_system WHERE guildId = ?', interaction.guild.id);
								await playSong(interaction, query, customEmoji, language_result);
							}
						}
						else {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.alreadyConnect.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.alreadyConnect.description)
								.setFooter({ text: `${language_result.alreadyConnect.embed_footer}`, iconURL: `${language_result.alreadyConnect.embed_icon_url}` })
								.setColor(0x78070d);
							await interaction.reply({ embeds: [embedLog] });
						}
					} else {
						await playSong(interaction, query, customEmoji, language_result);
					}
				} else {
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.noVoice.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.noVoice.description)
						.setFooter({ text: `${language_result.noVoice.embed_footer}`, iconURL: `${language_result.noVoice.embed_icon_url}` })
						.setColor(0x78070d);
					await interaction.reply({ embeds: [embedLog] });
				}
			} else {
				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.notFound.embed_title}`, iconURL: customEmoji })
					.setDescription(language_result.notFound.description)
					.setFooter({ text: `${language_result.notFound.embed_footer}`, iconURL: `${language_result.notFound.embed_icon_url}` })
					.setColor(0x78070d);
				await interaction.reply({ embeds: [embedLog] });
			}
		}
		catch (error) {
			errorSendControls(error, interaction.client, interaction.guild, "\\music-system\\play.js");
		}
	},
};