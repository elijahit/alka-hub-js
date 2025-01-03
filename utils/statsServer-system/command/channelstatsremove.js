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
const { removeStatistics, findStatisticsById } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('channelstatsremove')
		.setDescription('Use this command to remove your channel stats')
		.setDescriptionLocalization("it", "Usa questo comando per rimuovere le tue statistiche del canale")
		.addIntegerOption(id =>
			id
				.setName('id')
				.setDescription('ID to which you want to remove the channel stats')
				.setDescriptionLocalization("it", "ID a cui vuoi rimuovere le statistiche del canale")
				.setRequired(true)
		),
	async execute(interaction, variables) {
		const id = interaction.options.data[0].value;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "statsServer", async result => {
			try {
				if (result) {
					if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 6, false, language_result.noPermission.description_embed_no_features_by_system, 
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
						language_result.noPermission.description_embed_no_features, variables)) return;
				
					let checkStatistics = await findStatisticsById(interaction.guild.id, id, variables);
					checkStatistics = checkStatistics?.get({ plain: true });

					if (!checkStatistics) {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: emojis.statsServerSystem.main })
							.setDescription(language_result.removeCommand.description_embed_notset)
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						return;
					}
					// RIMUOVO LA REACTION ALTRIMENTI ANNULLO TUTTO
					await removeStatistics(interaction.guild.id, id, variables);

					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: emojis.statsServerSystem.main })
						.setDescription(language_result.removeCommand.description_embed.replace("{0}", id))
						.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
						.setColor(colors.general.danger);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });

				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\statsServer-system\\chgannelstatsremove.js", variables);
			}
		});
	},
};