// Code: utils/general/command/init.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file init.js
 * @module init
 * @description Questo file contiene il comando per inizializzare il bot sul server
 */

const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { read, readFileSync } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const emoji = require("../../../bin/data/emoji");
const colors = require("../../../bin/data/colors");
const Variables = require('../../../bin/classes/GlobalVariables');
const { findByGuildId } = require('../../../bin/repository/Guild');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init')
		.setDescription('Use this command to initialize the bot on your server'),
	async execute(interaction) {
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/general/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "init", async result => {
			try {
				if (result) {
					let guild = await findByGuildId(interaction.guild.id);
					guild = guild?.get({plain: true}) ?? null;

					const modal = new ModalBuilder()
						.setTitle(`${Variables.getBotName()} | Settings`)
						.setCustomId('configModal');

					const languageValue = guild?.language ?? "";
					const languageInput = new TextInputBuilder()
						.setCustomId('languageInput')
						.setLabel(language_result.initCommand.language_label)
						.setRequired(true)
						.setMaxLength(3)
						.setPlaceholder(language_result.initCommand.language_placeHolder)
						.setStyle(TextInputStyle.Short)
						.setValue(languageValue);
						const languageRow = new ActionRowBuilder().addComponents(languageInput);
						
						let timeZoneValue = guild?.time_zone ?? "";

						if(timeZoneValue !== "") {
							const timeZoneArray = require("../data/timeZone");
							const timeZoneFiltered = timeZoneArray.map(entry => entry.split('|'));
							timeZoneValue = timeZoneFiltered.filter(value => value[0] == timeZoneValue || value[1] == timeZoneValue)[0][0];
						}
	
						
						const timeZoneInput = new TextInputBuilder()
						.setCustomId('timeZoneInput')
						.setLabel(language_result.initCommand.time_zone_label)
						.setRequired(true)
						.setMaxLength(3)
						.setPlaceholder(language_result.initCommand.time_zone_placeHolder)
						.setStyle(TextInputStyle.Short)
						.setValue(timeZoneValue);
						const timeZoneRow = new ActionRowBuilder().addComponents(timeZoneInput);

						let planValue = guild?.premium == 1 ? "Premium" : "Free";
						const planInput = new TextInputBuilder()
						.setCustomId('planInput')
						.setLabel(language_result.initCommand.plan_label)
						.setRequired(false)
						.setMaxLength(1)
						.setPlaceholder(planValue)
						.setStyle(TextInputStyle.Short)
						const planZoneRow = new ActionRowBuilder().addComponents(planInput);
						
					modal.addComponents(languageRow, timeZoneRow, planZoneRow);
					await interaction.showModal(modal);
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\general\\init.js");
			}
		});
	},
};