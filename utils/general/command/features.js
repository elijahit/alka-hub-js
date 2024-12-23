// Code: utils/general/command/features.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file features.js
 * @module features
 * @description Questo file contiene il comando per abilitare o disabilitare le features
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { errorSendControls, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const { findFeatureById, updateEnabledFeature, getFeatureIsEnabled, createEnabledFeature, findGuildById } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('features')
		.setDescription('Use this command to enable or disable the features')
		.addIntegerOption(option =>
			option
				.addChoices({
					name: "Logs System",
					value: 1,
				})
				.addChoices({
					name: "Ticket System",
					value: 2,
				})
				.addChoices({
					name: "Auto Voice System",
					value: 3,
				})
				.addChoices({
					name: "Auto Role System",
					value: 4,
				})
				.addChoices({
					name: "Reaction Role System",
					value: 5,
				})
				.addChoices({
					name: "Stats Server System",
					value: 6,
				})
				.addChoices({
					name: "Twitch Notify System",
					value: 7,
				})
				.addChoices({
					name: "Youtube Notify System",
					value: 8,
				})
				.addChoices({
					name: "Giveaway System",
					value: 9,
				})
				.addChoices({
					name: "Welcome Message System",
					value: 10,
				})
				.addChoices({
					name: "Levels System",
					value: 11,
				})
				.setName('choices')
				.setDescription('Name of the system you want to enable or disable')
				.setRequired(true)
		),
	async execute(interaction) {
		const featuresChoice = interaction.options.data[0].value;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/general/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "features", async result => {
			try {
				let checkGuild = await findGuildById(interaction.guild.id);
				checkGuild = checkGuild?.get({plain: true}) ?? false;
				if(checkGuild) {
					if (result) {
						let checkFeature = await getFeatureIsEnabled(interaction.guild.id, featuresChoice);
						checkFeature = checkFeature?.get({ plain: true }).guilds[0].GuildEnabledFeatures ?? null;
						
						let featureTable = await findFeatureById(featuresChoice);
						let featureIsDisabled = await checkFeatureSystemDisabled(featuresChoice);
						let featureName = featureTable.get({ plain: true }).feature_name ?? null;
						let featurePremium = await checkPremiumFeature(interaction.guild.id, featuresChoice);

						if (!featureIsDisabled) {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.disabledFeatures.embed_title}`, iconURL: emoji.general.falseMaker })
								.setDescription(language_result.disabledFeatures.feature_disabled_by_alka)
								.setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
								.setColor(colors.general.error);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
							return;
						}

						if (!featurePremium) {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.disabledFeatures.embed_title}`, iconURL: emoji.general.falseMaker })
								.setDescription(language_result.disabledFeatures.feature_premium)
								.setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
								.setColor(colors.general.error);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
							return;
						}
	
						if (checkFeature) {
							if (checkFeature.is_enabled == 1) {
								await updateEnabledFeature({ is_enabled: 0 }, { where: { guild_id: interaction.guild.id, feature_id: featuresChoice, config_id: Variables.getConfigId() } });
								const embedLog = new EmbedBuilder()
									.setAuthor({ name: `${language_result.disabledFeatures.embed_title}`, iconURL: emoji.general.falseMaker })
									.setDescription(language_result.disabledFeatures.description_embed.replace("{0}", featureName))
									.setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
									.setColor(colors.general.error);
								await interaction.reply({ embeds: [embedLog], ephemeral: true });
							} else {
								await updateEnabledFeature({ is_enabled: 1 }, { where: { guild_id: interaction.guild.id, feature_id: featuresChoice, config_id: Variables.getConfigId() } });
								const embedLog = new EmbedBuilder()
									.setAuthor({ name: `${language_result.enabledFeatures.embed_title}`, iconURL: emoji.general.trueMaker })
									.setDescription(language_result.enabledFeatures.description_embed.replace("{0}", featureName))
									.setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
									.setColor(colors.general.success);
								await interaction.reply({ embeds: [embedLog], ephemeral: true });
							}
						} else {
							await createEnabledFeature(interaction.guild.id, featuresChoice, 1);
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.enabledFeatures.embed_title}`, iconURL: emoji.general.trueMaker })
								.setDescription(language_result.enabledFeatures.description_embed.replace("{0}", featureName))
								.setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
								.setColor(colors.general.success);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
						}
					}
					else {
						await noHavePermission(interaction, language_result);
					}
				} else {
					await noInitGuilds(interaction);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\general\\features.js");
			}
		});
	},
};