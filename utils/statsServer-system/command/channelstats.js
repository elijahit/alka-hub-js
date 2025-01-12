// Code: utils/statsServer-system/command/channelstats.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file channelstats.js
 * @module channelstats
 * @description Questo file gestisce il comando per impostare il proprio canale di statistica!
 */

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { errorSendControls, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const {findByGuildIdAndcategoryIdStatisticsCategory } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channelstats')
		.setDescription('Use this command to set your statistics channel')
		.setDescriptionLocalization("it", "Usa questo comando per impostare il tuo canale di statistiche")
		.addChannelOption(category =>
			category
				.setName('category')
				.setDescription('Category to place your channel statistics')
				.setDescriptionLocalization("it", "Categoria in cui inserire il tuo canale di statistiche")
				.addChannelTypes(ChannelType.GuildCategory)
				.setRequired(true)
		)
		.addIntegerOption(type =>
			type
				.setName('type')
				.setDescription('Channel type to insert')
				.setDescriptionLocalization("it", "Tipo di canale da inserire")
				.setRequired(true)
				.addChoices({
					name: "Date",
					value: 1,
				})
				.addChoices({
					name: "Hour",
					value: 2,
				})
				.addChoices({
					name: "Date / Hour",
					value: 3,
				})
				.addChoices({
					name: "Member Count",
					value: 4,
				})
				.addChoices({
					name: "Channel Count",
					value: 5,
				})
				.addChoices({
					name: "Bot Count",
					value: 6,
				})
				.addChoices({
					name: "Role Count",
					value: 7,
				})
				.addChoices({
					name: "Role Count Online",
					value: 8,
				})
				.addChoices({
					name: "Status Bar",
					value: 9,
				})
		),
	async execute(interaction, variables) {
		const categoryId = interaction.options.data[0].value;
		const type = interaction.options.data[1].value;
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "statsServer", async result => {
			try {
				if (result) {
					if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 6, true, language_result.noPermission.description_embed_no_features_by_system,
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
						language_result.noPermission.description_embed_no_features, variables)) return;

					let checkCategory = await findByGuildIdAndcategoryIdStatisticsCategory(interaction.guild.id, categoryId, variables);
					checkCategory = checkCategory?.get({ plain: true });
					if (checkCategory) {
						const modal = new ModalBuilder()
							.setCustomId("statsModal")
							.setTitle(language_result.setupModal.embed_title);

						const channelName = new TextInputBuilder()
							.setCustomId('statsChannelName')
							.setLabel(language_result.setupModal.description_embed_title)
							.setPlaceholder(language_result.setupModal.placeholder)
							.setMaxLength(40)
							.setStyle(TextInputStyle.Short);

						const categoryChannelId = new TextInputBuilder()
							.setCustomId('statsCategoryId')
							.setLabel(language_result.setupModal.category_embed)
							.setStyle(TextInputStyle.Short)
							.setValue(`${categoryId}`);

						const typeChannel = new TextInputBuilder()
							.setCustomId('statsTypeChannel')
							.setLabel(language_result.setupModal.type_embed)
							.setStyle(TextInputStyle.Short)
							.setValue(`${type}`);

						const channelNameRow = new ActionRowBuilder().addComponents(channelName);

						const categoryIdRow = new ActionRowBuilder().addComponents(categoryChannelId);

						const typeChannelRow = new ActionRowBuilder().addComponents(typeChannel);

						modal.addComponents(channelNameRow, categoryIdRow, typeChannelRow);

						await interaction.showModal(modal);

					} else {
						const embedLog = new EmbedBuilder()
							.setDescription(`## ${language_result.categoryNotFound.embed_title}\n` + language_result.categoryNotFound.description_embed)
							.setThumbnail(variables.getBotFooterIcon())
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], flags: 64 });
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