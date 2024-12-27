// Code: utils/statsServer-system/command/statistics.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file statistics.js
 * @module statistics
 * @description Questo file gestisce il comando per impostare la propria categoria di statistiche!
 */

const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { errorSendControls, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { createStatisticsCategory } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('statistics')
		.setDescription('Use this command to setup your statistics category'),
	async execute(interaction) {
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "statsServer", async result => {
			try {
				if (result) {
					if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 6, true, language_result.noPermission.description_embed_no_features_by_system,
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
						language_result.noPermission.description_embed_no_features)) return;
					// CREO LA CATEGORIA DA IMPOSTARE COME STATS CATEGORY
					const category = await interaction.guild.channels.create({
						type: ChannelType.GuildCategory,
						permissionOverwrites: [
							{
								id: interaction.guild.roles.everyone,
								allow: [PermissionsBitField.Flags.ViewChannel],
								deny: [PermissionsBitField.Flags.Connect],
								type: 0,
							}
						],
						name: "💻 ServerStats",
					});
					await category.setPosition(0); // Imposto la posizione del canale in cima.
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.statisticsCommand.embed_title}`, iconURL: emoji.statsServerSystem.main })
						.setDescription(language_result.statisticsCommand.description_embed)
						.setFooter({ text: Variables.getBotFooter(), iconURL: Variables.getBotFooterIcon() })
						.setColor(colors.general.success);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
					await createStatisticsCategory(interaction.guild.id, category.id);

				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\statsServer-system\\statistics.js");
			}
		});
	},
};