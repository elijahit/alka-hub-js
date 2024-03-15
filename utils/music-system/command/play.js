const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const {joinVoiceChannel, createAudioResource, createAudioPlayer, AudioResource, AudioPlayer} = require('@discordjs/voice')
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');
const ytdl = require('ytdl-core');

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
		const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		
		try {
			if(ytdl.validateURL(query)) {
				if(interaction.member.voice.channelId) {
					const voiceChannel = await interaction.guild.channels.fetch(interaction.member.voice.channelId);
					const player = createAudioPlayer();
					const connection = joinVoiceChannel({
						channelId: interaction.member.voice.channelId,
						guildId: interaction.guild.id,
						adapterCreator: voiceChannel.guild.voiceAdapterCreator
					}).subscribe(player);
					
					const stream = ytdl(query, {filter: 'audioonly'});
					
					
					console.log(stream)
					player.play(createAudioResource(stream))
	
					// console.log(connection)
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