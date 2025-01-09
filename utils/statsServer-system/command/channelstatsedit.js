// Code: utils/statsServer-system/command/channelstatsedit.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file channelstatsedit.js
 * @module channelstatsedit
 * @description Questo file gestisce il comando per modificare il nome del proprio canale di statistiche!
 */

const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { errorSendControls, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { findByGuildIdAndChannelIdStatistics } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channelstatsedit')
		.setDescription('Use this command to edit name your statistics channel')
		.setDescriptionLocalization("it", "Usa questo comando per modificare il nome del tuo canale di statistiche")
		.addChannelOption(channel =>
			channel
				.setName('channel')
				.setDescription('Select a channel statistics')
				.setDescriptionLocalization("it", "Seleziona un canale di statistiche")
				.addChannelTypes(ChannelType.GuildVoice)
				.setRequired(true)
		),
	async execute(interaction, variables) {
		const channelId = interaction.options.data[0].value;
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

					
					let checkChannel = await findByGuildIdAndChannelIdStatistics(interaction.guild.id, channelId, variables);
					checkChannel = checkChannel?.get({ plain: true });

					if (checkChannel) {
						const modal = new ModalBuilder()
							.setCustomId("statsModalEdit")
							.setTitle(language_result.setupModal.embed_title);

						const channelName = new TextInputBuilder()
							.setCustomId('statsChannelName')
							.setLabel(language_result.setupModal.description_embed_title)
							.setPlaceholder(language_result.setupModal.placeholder)
							.setMaxLength(40)
							.setStyle(TextInputStyle.Short);

						const channelIdText = new TextInputBuilder()
							.setCustomId('statsChannelId')
							.setLabel(language_result.setupModal.category_embed)
							.setStyle(TextInputStyle.Short)
							.setValue(`${channelId}`);


						const channelNameRow = new ActionRowBuilder().addComponents(channelName);

						const channelIdRow = new ActionRowBuilder().addComponents(channelIdText);

						modal.addComponents(channelNameRow, channelIdRow);

						await interaction.showModal(modal);

					} else {
						const embedLog = new EmbedBuilder()
							.setDescription(`## ${language_result.categoryNotFound.embed_title}\n` + language_result.channelNotFound.description_embed)
							.setThumbnail(variables.getBotFooterIcon())
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					}

				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\statsServer-system\\channelstats.js", variables);
			}
		});
	},
};