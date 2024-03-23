const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, getVoiceConnection } = require('@discordjs/voice')
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDb, runDb, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');
const play = require('play-dl');


// FUNZIONI DA GESTORE
async function searchSong(query, interaction) {
	let searchValue, isPlaylist = 0, typePlaylist;
	if ((await play.validate(query)).includes("playlist")) {
		let playlistArray, valueOfTitle;
		// SE E' UNA PLAYLIST
		switch (await play.validate(query)) {
			case "yt_playlist":
				const youtubePlaylist = await play.playlist_info(query);
				playlistArray = youtubePlaylist.videos;
				valueOfTitle = ["title"];
				break;
			case "so_playlist":
				const soundCloudPlaylist = await play.playlist_info(query);
				playlistArray = soundCloudPlaylist.tracks;
				valueOfTitle = ["name"];
				break;
			case "sp_playlist":
				const spotifyPlaylist = await play.spotify(query);
				playlistArray = spotifyPlaylist.fetched_tracks.get('1');
				valueOfTitle = ["name"];
				typePlaylist = "spotify"
				break;
			case "dz_playlist":
				const deezerPlaylist = await play.deezer(query);
				playlistArray = deezerPlaylist.tracks;
				valueOfTitle = ["title"];
				typePlaylist = "deezer"
				break;
		}

		for await (const value of playlistArray) {	
			let valueSaveDb;
			if(typePlaylist == "spotify") {
				valueSaveDb = `${value[valueOfTitle]} ${value?.artists[0]?.name}`
				if (isPlaylist == 0) {
					searchValue = `${value[valueOfTitle]} ${value?.artists[0]?.name}`;
				}
			}
			else if (typePlaylist == "deezer") {
				valueSaveDb = `${value[valueOfTitle]} ${value?.artist?.name}`
				if (isPlaylist == 0) {
					searchValue = `${value[valueOfTitle]} ${value?.artist?.name}`;
				}
			} else {
				valueSaveDb = `${value[valueOfTitle]}`
				if (isPlaylist == 0) {
					searchValue = `${value[valueOfTitle]}`;
				}
			}
			isPlaylist++;
			await runDb("INSERT INTO music_queue_system (guildId, voiceChannelId, name) VALUES (?, ?, ?)", interaction.guild.id, interaction.member.voice.channelId, valueSaveDb);
		}
	} else if ((await play.validate(query)).includes("album")) {
		let playlistArray, valueOfTitle;
		// SE E' UN ALBUM
		switch (await play.validate(query)) {
			case "sp_album":
				const spotifyPlaylist = await play.spotify(query);
				playlistArray = spotifyPlaylist.fetched_tracks.get('1');
				valueOfTitle = ["name"];
				break;
			case "dz_album":
				const deezerPlaylist = await play.deezer(query);
				playlistArray = deezerPlaylist.tracks;
				valueOfTitle = ["title"];
				break;
		}

		for await (const value of playlistArray) {
			if (isPlaylist == 0) {
				searchValue = value[valueOfTitle];
			}
			isPlaylist++;
			await runDb("INSERT INTO music_queue_system (guildId, voiceChannelId, name) VALUES (?, ?, ?)", interaction.guild.id, interaction.member.voice.channelId, value[valueOfTitle]);
		}
	}
	else if ((await play.validate(query)).includes("video") || (await play.validate(query)).includes("track")) {

		let videoName;
		// SE E' UNA CANZONE
		switch (await play.validate(query)) {
			case "yt_video":
				const youtubeVideo = await play.video_info(query);
				videoName = youtubeVideo.video_details.title;
				break;
			case "so_track":
				const soundCloudVideo = await play.soundcloud(query);
				videoName = soundCloudVideo.name;
				break;
			case "sp_track":
				const spotifyTrack = await play.spotify(query);
				videoName = spotifyTrack.name;
				break;
			case "dz_track":
				const deezerTrack = await play.deezer(query);
				videoName = deezerTrack.title;
				break;
		}
		await runDb("INSERT INTO music_queue_system (guildId, voiceChannelId, name) VALUES (?, ?, ?)", interaction.guild.id, interaction.member.voice.channelId, videoName);
		searchValue = videoName;
	} else {
		searchValue = query;
		const searched = await play.search(searchValue, {
			limit: 1
		});
		await runDb("INSERT INTO music_queue_system (guildId, voiceChannelId, name) VALUES (?, ?, ?)", interaction.guild.id, interaction.member.voice.channelId, searched[0].title);
	}
	return {searchValue, isPlaylist};
}

async function playSong(interaction, query, customEmoji, language_result) {
	await interaction.deferReply();

	//RESETTO I DATI
	if (!getVoiceConnection(interaction.guild.id) || getVoiceConnection(interaction.guild.id)?._state.status == "disconnected") {
		await runDb('DELETE FROM music_queue_system WHERE guildId = ?', interaction.guild.id);
		await runDb('DELETE FROM music_vote_system WHERE guildId = ?', interaction.guild.id);
	}

	let searchValue = (await searchSong(query, interaction)).searchValue;
	let isPlaylist = (await searchSong(query, interaction)).isPlaylist;
	try {
		if (!getVoiceConnection(interaction.guild.id) || getVoiceConnection(interaction.guild.id)?._state.status == "disconnected") {
			const voiceChannel = await interaction.guild.channels.fetch(interaction.member.voice.channelId);
			// SE NON CI SONO DATI IN RIPRODUZIONE VIENE INSTANZIATA UNA CONNESSIONE E AVVIATA LA RIPRODUZIONE DI UN URL
			const searched = await play.search(searchValue, {
				limit: 1
			});
			const player = createAudioPlayer();
			await eventPlayer(player, interaction.channel, searched[0].url, interaction.guild.id);
			const connection = joinVoiceChannel({
				channelId: interaction.member.voice.channelId,
				guildId: interaction.guild.id,
				adapterCreator: voiceChannel.guild.voiceAdapterCreator
			}).subscribe(player);


			let stream = await play.stream(searched[0].url);

			player.play(createAudioResource(stream.stream, { inputType: stream.type }))
			const embedLog = new EmbedBuilder()
				.setAuthor({ name: `${language_result.ready.embed_title}`, iconURL: customEmoji })
				.setDescription(language_result.ready.description)
				.setFooter({ text: `${language_result.ready.embed_footer}`, iconURL: `${language_result.ready.embed_icon_url}` })
				.setColor(0x3d4c52);
			await interaction.editReply({ embeds: [embedLog] });
		} else {
			if (isPlaylist == 0) {
				const searched = await play.search(searchValue, {
					limit: 1
				});
				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.addQueue.embed_title}`, iconURL: customEmoji })
					.setDescription(language_result.addQueue.description.replace("{0}", `${searched[0].title}`))
					.setFooter({ text: `${language_result.addQueue.embed_footer}`, iconURL: `${language_result.addQueue.embed_icon_url}` })
					.setColor(0x3d4c52);
				await interaction.editReply({ embeds: [embedLog] });
			} else {
				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.addQueuePlaylist.embed_title}`, iconURL: customEmoji })
					.setDescription(language_result.addQueuePlaylist.description.replace("{0}", `${isPlaylist}`))
					.setFooter({ text: `${language_result.addQueuePlaylist.embed_footer}`, iconURL: `${language_result.addQueuePlaylist.embed_icon_url}` })
					.setColor(0x3d4c52);
				await interaction.editReply({ embeds: [embedLog] });
			}
		}
	}
	catch {
		const embedLog = new EmbedBuilder()
			.setAuthor({ name: `${language_result.notFound.embed_title}`, iconURL: customEmoji })
			.setDescription(language_result.notFound.description)
			.setFooter({ text: `${language_result.notFound.embed_footer}`, iconURL: `${language_result.notFound.embed_icon_url}` })
			.setColor(0x3d4c52);
		await interaction.editReply({ embeds: [embedLog] });
	}

}
async function playMessage(query, customEmoji, language_result, channel) {
	const searched = await play.search(query, {
		limit: 1
	});
	const videoInfo = await play.video_info(searched[0].url);

	let checkDatabase = await readDbAllWith1Params("SELECT * FROM music_queue_system WHERE guildId = ?", channel.guild.id);

	const embedLog = new EmbedBuilder()
		.setAuthor({ name: `${language_result.playing.embed_title}`, iconURL: customEmoji })
		.setDescription(language_result.playing.description)
		.setFooter({ text: `${language_result.playing.embed_footer}`, iconURL: `${language_result.playing.embed_icon_url}` })
		.setFields([
			{ name: language_result.playing.songTitle, value: `${videoInfo.video_details.title}` },
			{ name: `${language_result.playing.queueSlot} (${checkDatabase.length})`, value: ` ` }
		])
		.setColor(0x09475c);
	await channel.send({ embeds: [embedLog] });
}

async function queueEnd(customEmoji, language_result, channel) {

	const embedLog = new EmbedBuilder()
		.setAuthor({ name: `${language_result.queueEnd.embed_title}`, iconURL: customEmoji })
		.setDescription(language_result.queueEnd.description)
		.setFooter({ text: `${language_result.queueEnd.embed_footer}`, iconURL: `${language_result.queueEnd.embed_icon_url}` })
		.setColor(0x09185e);
	await channel.send({ embeds: [embedLog] });
}

async function noUserOnline(customEmoji, language_result, channel) {

	const embedLog = new EmbedBuilder()
		.setAuthor({ name: `${language_result.noUserOnline.embed_title}`, iconURL: customEmoji })
		.setDescription(language_result.noUserOnline.description)
		.setFooter({ text: `${language_result.noUserOnline.embed_footer}`, iconURL: `${language_result.noUserOnline.embed_icon_url}` })
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
			let guildResolve = await channel.client.guilds.fetch(guild);
			let channelResolve = await guildResolve.channels.fetch(getVoiceConnection(guild).joinConfig.channelId);
			let userCount = 0;
			for await (const value of channelResolve.members) {
				if (!value[1].user.bot) {
					userCount++;
				}
			}
			if (!userCount) {
				getVoiceConnection(guild).disconnect();
				await runDb('DELETE FROM music_queue_system WHERE guildId = ?', guild);
				await noUserOnline(query, customEmoji, language_result, channel);
				return;
			}
			await playMessage(query, customEmoji, language_result, channel);

		}
		if (newState.status == "idle") {
			// CONTROLLO IL DATABASE E LI SORTEGGIO TRAMITE ID
			let checkDatabase = await readDbAllWith1Params('SELECT * FROM music_queue_system WHERE guildId = ? ORDER BY ID', guild);
			if (checkDatabase.length > 1) {
				query = checkDatabase[1].name;
				const searched = await play.search(query, {
					limit: 1
				});

				let stream = await play.stream(searched[0].url);

				player.play(createAudioResource(stream.stream, { inputType: stream.type }))
				await runDb('DELETE FROM music_queue_system WHERE ID = ?', checkDatabase[0].ID);
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

			// IMPOSTO IL TOKEN GRATUITO
			let soundCloundClient = play.getFreeClientID();

			let markets = "EN";
			if (query.includes('https')) {
				if (query.includes("intl")) {
					let result = query.split('-')[1].split("/")[0];
					markets = result.toUpperCase();
				}
			}

			await play.setToken({
				soundcloud: {
					client_id: soundCloundClient
				},
				spotify: {
					client_id: "e96d460ae192441186c9969f3d22e319",
					client_secret: "625e8dc861814709b72f9642dd9a9d8e",
					refresh_token: "AQCcQd090qffLTPwixdWuZn-sLR3IUE6WlkEMXfCGn9gGpR3vBTpPhGBYibQQLSWihCf8qXrNJek8bxRIrCcWl4NoUzfHmV4TI0TKaK4LprdzcUkWQ3_P4Aeol6Q-NajP1c",
					market: markets
				}
			});
			// CONTROLLO SE IL LINK è VALIDO
			if (await play.validate(query)) {
				// CONTROLLO SE IL COMANDO VIENE ESEGUITO DENTRO UN CANALE VOCALE
				if (interaction.member.voice.channelId) {
					// CONTROLLO IL DATABASE PER VISUALIZZARNE I DATI
					let checkDatabase = await readDbAllWith1Params("SELECT * FROM music_queue_system WHERE guildId = ?", interaction.guild.id);

					// CONTROLLO SE IL DATABASE HA GIA' DEI DATI IN RIPRODUZIONE
					if (checkDatabase.length > 0 && getVoiceConnection(interaction.guild.id)) {
						if (checkDatabase[0].voiceChannelId == interaction.member.voice.channelId) {
							await playSong(interaction, query, customEmoji, language_result);
						}
						else {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.alreadyConnect.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.alreadyConnect.description)
								.setFooter({ text: `${language_result.alreadyConnect.embed_footer}`, iconURL: `${language_result.alreadyConnect.embed_icon_url}` })
								.setColor(0x78070d);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
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
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}
			} else {
				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.notFound.embed_title}`, iconURL: customEmoji })
					.setDescription(language_result.notFound.description)
					.setFooter({ text: `${language_result.notFound.embed_footer}`, iconURL: `${language_result.notFound.embed_icon_url}` })
					.setColor(0x78070d);
				await interaction.reply({ embeds: [embedLog], ephemeral: true });
			}
		}
		catch (error) {
			errorSendControls(error, interaction.client, interaction.guild, "\\music-system\\play.js");
		}
	},
};