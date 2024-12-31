// Code: utils/statsServer-system/command/markdownstats.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file markdownstats.js
 * @module markdownstats
 * @description Questo file gestisce il comando per visualizzare l'aiuto per il markdown di Stats Server!
 */

const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { errorSendControls, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('markdownstats')
		.setDescription('Use this command to display help for the markdown of Stats Server'),
	async execute(interaction, variables) {
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "statsServer", async result => {
			try {
				if (result) {
					if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 6, false, language_result.noPermission.description_embed_no_features_by_system,
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
						language_result.noPermission.description_embed_no_features, variables)) return;

					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.markdownHelp.embed_title}`, iconURL: emoji.statsServerSystem.main })
						.setDescription(language_result.markdownHelp.description_embed)
						.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
						.setColor(colors.general.success);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });

				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\statsServer-system\\statistics.js", variables);
			}
		});
	},
};