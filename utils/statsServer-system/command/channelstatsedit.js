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
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channelstatsedit')
		.setDescription('Use this command to edit name your statistics channel')
		.addChannelOption(channel =>
			channel
				.setName('channel')
				.setDescription('Select a channel statistics')
				.addChannelTypes(ChannelType.GuildVoice)
				.setRequired(true)
		),
	async execute(interaction) {
		const channelId = interaction.options.data[0].value;
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "statsServer", async result => {
			try {
				if (result) {
					if (await checkFeaturesIsEnabled(interaction.guild.id, 6)) {
						const checkChannel = await readDb('SELECT * FROM statistics WHERE guilds_id = ? AND channel_id = ?', interaction.guild.id, channelId);
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
								.setAuthor({ name: `${language_result.categoryNotFound.embed_title}`, iconURL: emoji.statsServerSystem.main })
								.setDescription(language_result.channelNotFound.description_embed)
								.setFooter({ text: `${language_result.categoryNotFound.embed_footer}`, iconURL: `${language_result.categoryNotFound.embed_icon_url}` })
								.setColor(colors.general.error);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
						}
					} else {
						await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\statsServer-system\\channelstats.js");
			}
		});
	},
};