const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channelstats')
		.setDescription('Use this command to set your statistics channel')
		.addChannelOption(category =>
			category
				.setName('category')
				.setDescription('Category to place your channel statistics')
				.addChannelTypes(ChannelType.GuildCategory)
				.setRequired(true)
		)
		.addIntegerOption(type =>
			type
				.setName('type')
				.setDescription('Channel type to insert')
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
	async execute(interaction) {
		const categoryId = interaction.options.data[0].value;
		const type = interaction.options.data[1].value;
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "statsServer", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT statsServerSystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					const customEmoji = await getEmojifromUrl(interaction.client, "stats");
					if (checkFeaturesisEnabled?.statsServerSystem_enabled) {
						const checkCategory = await readDbAllWith2Params('SELECT * FROM stats_system_category WHERE guildId = ? AND categoryId = ?', interaction.guild.id, categoryId)
						if (checkCategory[0]) {
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
								.setAuthor({ name: `${language_result.categoryNotFound.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.categoryNotFound.description_embed)
								.setFooter({ text: `${language_result.categoryNotFound.embed_footer}`, iconURL: `${language_result.categoryNotFound.embed_icon_url}` })
								.setColor(0xad322a);
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