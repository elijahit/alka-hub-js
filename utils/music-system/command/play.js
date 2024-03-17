const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, getVoiceConnection } = require('@discordjs/voice')
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDb, runDb, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');
const ytdl = require('ytdl-core');

// FUNZIONI DA GESTORE
async function playSong(interaction, query) {
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
	await runDb("INSERT INTO music_queue_system (guildId, voiceChannelId, url) VALUES (?, ?, ?)", interaction.guild.id, voiceChannel.id, query);
}
async function playMessage(query, customEmoji, language_result, channel) {
	const videoInfo = await ytdl.getInfo(query);

	const embedLog = new EmbedBuilder()
		.setAuthor({ name: `${language_result.playing.embed_title}`, iconURL: customEmoji })
		.setDescription(language_result.playing.description)
		.setFooter({ text: `${language_result.playing.embed_footer}`, iconURL: `${language_result.playing.embed_icon_url}` })
		.setFields([
			{ name: language_result.playing.songTitle, value: `${videoInfo.player_response.videoDetails.title}` }
		])
		.setColor(0x6e0b8c);
	await channel.send({ embeds: [embedLog] });
}

async function queueEnd(query, customEmoji, language_result, channel) {
	const videoInfo = await ytdl.getInfo(query);

	const embedLog = new EmbedBuilder()
		.setAuthor({ name: `${language_result.queueEnd.embed_title}`, iconURL: customEmoji })
		.setDescription(language_result.queueEnd.description)
		.setFooter({ text: `${language_result.queueEnd.embed_footer}`, iconURL: `${language_result.queueEnd.embed_icon_url}` })
		.setColor(0x6e0b8c);
	await channel.send({ embeds: [embedLog] });
}


async function eventPlayer(player = "AudioPlayer", channel = "TextChannel", query = "Song", guild = "Guild Id") {
	let customEmoji = await getEmojifromUrl(channel.client, "twitch");
	// RECUPERO LA LINGUA
	let data = await language.databaseCheck(guild);
	const langagues_path = readFileSync(`./languages/music-system/${data}.json`);
	const language_result = JSON.parse(langagues_path);

	player.on('stateChange', async (oldState, newState) => {
		if(newState.status == "playing") {
		await playMessage(query, customEmoji, language_result, channel);

		}
		if(newState.status == "idle") {
			// CONTROLLO IL DATABASE E LI SORTEGGIO TRAMITE ID
			let checkDatabase = await readDbAllWith1Params('SELECT * FROM music_queue_system WHERE guildId = ? ORDER BY ID', guild);
			if(checkDatabase.length > 1) {
				query = checkDatabase[1].url;
				const stream = ytdl(query, { filter: 'audioonly' });
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
			// CONTROLLO SE IL LINK è VALIDO SU YOUTUBE
			if (ytdl.validateURL(query)) {
				// CONTROLLO SE IL COMANDO VIENE ESEGUITO DENTRO UN CANALE VOCALE
				if (interaction.member.voice.channelId) {
					// CONTROLLO IL DATABASE PER VISUALIZZARNE I DATI
					let checkDatabase = await readDbAllWith2Params("SELECT * FROM music_queue_system WHERE voiceChannelId = ? AND guildId = ?", interaction.member.voice.channelId, interaction.guild.id);

					// CONTROLLO SE IL DATABASE HA GIA' DEI DATI IN RIPRODUZIONE
					if (checkDatabase.length != 0) {
						if (checkDatabase[0].voiceChannelId == interaction.member.voice.channelId) {
							if(getVoiceConnection(interaction.guild.id)?.state.status == "ready") {
								await runDb("INSERT INTO music_queue_system (guildId, voiceChannelId, url) VALUES (?, ?, ?)", interaction.guild.id, interaction.member.voice.channelId, query);
							} else {
								await runDb('DELETE FROM music_queue_system WHERE guildId = ?', interaction.guild.id);
								await playSong(interaction, query);
							}
						}
						else {
							//SE IL BOT è GIA CONNESSO IN UN CANALE VOCALE E IL COMANDO VIENE ESEGUITO IN UN ALTRO CANALE VOCALE.
						}
					} else {
						await playSong(interaction, query);
					}


				}
			} else {
				// SE UN VIDEO NON E' VALIDO
			}
		}
		catch (error) {
			errorSendControls(error, interaction.client, interaction.guild, "\\music-system\\play.js");
		}
	},
};