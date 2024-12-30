// Code: utils/general/command/help.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file help.js
 * @module help
 * @description Questo file contiene il comando per visualizzare la lista completa dei comandi nel server
 */ 

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const emoji = require("../../../bin/data/emoji")
const colors = require("../../../bin/data/colors");
const Variables = require('../../../bin/classes/GlobalVariables');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Command to view the complete list of commands in the server')
		.addStringOption(value =>
			value
				.setName('module')
				.setDescription('Select a module to view its help page')
				.addChoices({
					name: "General Command",
					value: "general",
				})
				.addChoices({
					name: "Logs System",
					value: "logs",
				})
				.addChoices({
					name: "Admin Ranks",
					value: "permissions",
				})
				.addChoices({
					name: "Ticket System",
					value: "ticket",
				})
				.addChoices({
					name: "Auto Voice System",
					value: "autovoice",
				})
				.addChoices({
					name: "Auto Role System",
					value: "autorole",
				})
				.addChoices({
					name: "Reaction Role System",
					value: "reactionrole",
				})
				.addChoices({
					name: "Statistics System",
					value: "statistics",
				})
				.addChoices({
					name: "Twitch Notify System",
					value: "twitch",
				})
				.addChoices({
					name: "YouTube Notify System",
					value: "youtube",
				})
				.addChoices({
					name: "Music Bot System",
					value: "musicbot",
				})
				.addChoices({
					name: "Giveaway System",
					value: "giveaway",
				})
				.addChoices({
					name: "Welcome Message",
					value: "welcome",
				})
		),
	async execute(interaction, variables) {
		let moduleSelect = await interaction.options.get("module")?.value;
		// RECUPERO LA LINGUA
		try {
			let data = await language.databaseCheck(interaction.guild.id, variables);
			const langagues_path = readFileSync(`./languages/general/${data}.json`);
			const language_result = JSON.parse(langagues_path);

			let fields = [];
			const embedLog = new EmbedBuilder();
			if (moduleSelect) {
				fields = [
					{ name: language_result.helpCommand[`${moduleSelect}_category`], value: language_result.helpCommand[`${moduleSelect}_commands`].replaceAll("{0}", variables.getBotName()) }
				];
				embedLog.setDescription(language_result.helpCommand.description_embed);
			} else {
				fields = [{ name: language_result.helpCommand.noModuleSelectTitle, value: language_result.helpCommand.noModuleSelectEmbed.replaceAll("{0}", variables.getBotName()) }]
			}
			const customEmoji = emoji.general.helpMaker;
			embedLog
				.setAuthor({ name: `${language_result.helpCommand.embed_title}`, iconURL: customEmoji })
				.addFields(fields)
				.setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
				.setColor(colors.general.blue);
			await interaction.reply({ embeds: [embedLog], ephemeral: true });
		}
		catch (error) {
			errorSendControls(error, interaction.client, interaction.guild, "\\general\\help.js", variables);
		}
	},
};