const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Command to view the complete list of commands in the server'),
	async execute(interaction) {
		// RECUPERO LA LINGUA
		try {
			let data = await language.databaseCheck(interaction.guild.id);
			const langagues_path = readFileSync(`./languages/general/${data}.json`);
			const language_result = JSON.parse(langagues_path);

			const fields = [];
			// COMMANDS
			fields.push(
				{name: language_result.helpCommand.general_category, value: language_result.helpCommand.general_commands},
				{name: language_result.helpCommand.logs_category, value: language_result.helpCommand.logs_commands},
				{name: language_result.helpCommand.admin_category, value: language_result.helpCommand.admin_commands},
				{name: language_result.helpCommand.ticket_category, value: language_result.helpCommand.ticket_commands},
				{name: language_result.helpCommand.autovoice_category, value: language_result.helpCommand.autovoice_commands},
				{name: language_result.helpCommand.autorole_category, value: language_result.helpCommand.autorole_commands},
				{name: language_result.helpCommand.reactionrole_category, value: language_result.helpCommand.reactionrole_commands}
			);

			// FOOTER
			fields.push({name: " ", value: language_result.helpCommand.footer});
			
			const customEmoji = await getEmojifromUrl(interaction.client, "help");
			const embedLog = new EmbedBuilder()
				.setAuthor({ name: `${language_result.helpCommand.embed_title}`, iconURL: customEmoji })
				.setDescription(language_result.helpCommand.description_embed)
				.addFields(fields)
				.setFooter({ text: `${language_result.helpCommand.embed_footer}`, iconURL: `${language_result.helpCommand.embed_icon_url}` })
				.setColor(0x3262a8);
			await interaction.reply({embeds: [embedLog], ephemeral: true});
		}
		catch (error) {
			errorSendControls(error, interaction.client, interaction.guild, "\\general\\help.js");
		}
	},
};