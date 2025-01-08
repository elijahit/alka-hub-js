// Code: utils/statsServer-system/command/channelstatsremove.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file channelstatsremove.js
 * @module channelstatsremove
 * @description Questo file gestisce il comando per rimuovere le proprie statistiche del canale!
 */

const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { errorSendControls, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emojis = require('../../../bin/data/emoji');
const color = require('../../../bin/data/colors');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { findByGuildIdAndIdLevel } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');
const emoji = require('../../../bin/data/emoji');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('levelroleremove')
		.setDescription('Use this command to remove your role level')
		.setDescriptionLocalization("it", "Usa questo comando per rimuovere il tuo ruolo")
		.addIntegerOption(id =>
			id
				.setName('id')
				.setDescription('ID to which you want to remove the role level')
				.setDescriptionLocalization("it", "ID a cui vuoi rimuovere il ruolo")
				.setRequired(true)
		),
	async execute(interaction, variables) {
		const id = interaction.options.data[0].value;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "statsServer", async result => {
			try {
				if (result) {
					if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 11, false, language_result.noPermission.description_embed_no_features_by_system,
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
						language_result.noPermission.description_embed_no_features, variables)) return;

					let checkLevelsIsPresent = await findByGuildIdAndIdLevel(interaction.guild.id, id, variables);
					checkLevelsIsPresent = checkLevelsIsPresent?.get({ plain: true });


					if (checkLevelsIsPresent) {
						await removeLevelsRoles({ where: { guild_id: interaction.guild.id, id: id, config_id: variables.getConfigId() } });

						const embedLog = new EmbedBuilder()
							.setDescription(`## ${language_result.levelsCommand.embed_title}\n` + language_result.levelsCommand.description_embed_delrole.replace("{0}", role))
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setThumbnail(variables.getBotFooterIcon())
							.setColor(colors.general.success);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					} else {
						const embedLog = new EmbedBuilder()
							.setDescription(`## ${language_result.levelsCommand.embed_title}\n` + language_result.levelsCommand.description_embed_no_role)
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setThumbnail(variables.getBotFooterIcon())
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					}

				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\levels-system\\chgannelstatsremove.js", variables);
			}
		});
	},
};