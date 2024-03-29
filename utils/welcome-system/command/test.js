const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const { makeWelcomeImage } = require('../welcomeHandling');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Command to view the complete list of commands in the server'),
	async execute(interaction) {
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/welcome-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);

		let imageResolve = await makeWelcomeImage(interaction.user.avatarURL(), interaction.user, interaction.guild.name, language_result, 0, "https://i.pinimg.com/originals/91/9c/57/919c5719579d855d1fa9e1c128a80d64.jpg");

		const file = new AttachmentBuilder(imageResolve, {
			name: "welcome.jpg"
		})
		const test = new EmbedBuilder()
			.setImage("attachment://welcome.jpg");

		await interaction.reply({files: [file],embeds: [test]})
	},
};