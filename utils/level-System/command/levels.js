// Code: utils/level-system/command/levels.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file levels.js
 * @module levels
 * @description Questo file contiene il comando per impostare il sistema di livelli
 */

const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { findLevelsConfigByGuildId, removeLevelsConfig, createLevelsConfig } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('levels')
		.setDescription('Use this command to set your levels system.')
		.addChannelOption(channel =>
			channel
				.setName('channel')
				.setDescription('The channel in which level notifications are sent')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true)
		),
	async execute(interaction, variables) {
		const channel = interaction.options.data[0].channel;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "levels", async result => {
			try {
				if (result) {
					if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 11, false, language_result.noPermission.description_embed_no_features_by_system, 
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
						language_result.noPermission.description_embed_no_features, variables)) return;

					let checkChannelIsPresent = await findLevelsConfigByGuildId(interaction.guild.id, variables);
					checkChannelIsPresent = checkChannelIsPresent?.get({ plain: true });
					

					const customEmoji = emoji.levelsSystem.levelsMaker;

					if (checkChannelIsPresent) {
						await removeLevelsConfig({where: { guild_id: interaction.guild.id, config_id: variables.getConfigId() }});

						const oldChannel = await interaction.guild.channels.fetch(checkChannelIsPresent.log_channel);

						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.levelsCommand.description_embed_delete.replace("{0}", oldChannel))
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						return;
					}
					await createLevelsConfig(interaction.guild.id, channel.id, variables);

					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.levelsCommand.description_embed.replace("{0}", channel))
						.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
						.setColor(colors.general.success);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });

				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\levels-system\\levels.js", variables);
			}
		});
	},
};