const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDbAllWith2Params, readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticketcomponents')
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription("Provide the ID of the ticket message")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("prefix")
				.setDescription("Provide the prefix (UNIQUE) of the ticket message")
				.setRequired(true)
				.setMaxLength(3)
		)
		.addStringOption(option =>
			option
				.setName("label")
				.setDescription("Provide the name of the component")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("emoji")
				.setDescription("Provide the emoji of the component")
				.setRequired(true)
		)
		.addNumberOption(option =>
			option
				.addChoices({
					name: "Danger",
					value: 4,
				})
				.addChoices({
					name: "Primary",
					value: 1,
				})
				.addChoices({
					name: "Secondary",
					value: 2,
				})
				.addChoices({
					name: "Success",
					value: 3,
				})
				.setName("style")
				.setDescription("Provide the style of the component")
				.setRequired(true)
		)
		.setDescription('Use this command to set the ticket components'),
	async execute(interaction) {
		let messageChoice, labelChoice, emojiChoice, styleChoice, prefixChoice;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'message') messageChoice = value.value;
			if (value.name == 'label') labelChoice = value.value;
			if (value.name == 'emoji') emojiChoice = value.value;
			if (value.name == 'style') styleChoice = value.value;
			if (value.name == 'prefix') prefixChoice = value.value;
		});

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);

		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "ticket", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT ticketSystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					if (checkFeaturesisEnabled?.ticketSystem_enabled) {
						const checkMessageonDb = await readDb(`SELECT * from ticket_system_message WHERE messageId = ?`, messageChoice);

						let message;
						try {
							message = await interaction.channel.messages.fetch(messageChoice);
						} catch {
							message = undefined;
						}

						if (checkMessageonDb && message) {
							const button = new ButtonBuilder();

							try {
								if (emojiChoice.includes(":")) {
									emojiChoice = emojiChoice.split(":")[2];
									let emojiId = emojiChoice.slice(-emojiChoice.length, emojiChoice.length - 1);
									button.setEmoji({ id: `${emojiId}` });
								} else {
									button.setEmoji({ name: emojiChoice });
								}
							} catch {
								// Passa comunque e non settare Emoji
							}
							const embedLog = new EmbedBuilder();
							button
								.setCustomId(prefixChoice)
								.setLabel(labelChoice)
								.setStyle(styleChoice);

							const buttonRow = new ActionRowBuilder();

							// RECUPERO I BOTTONI GIA' ESISTENTI
							await message.components.forEach(async value => {
								await value.components.forEach(components => {
									buttonRow.addComponents(components);
								})
							})

							buttonRow.addComponents(button);
							try {
								await message.edit({ components: [buttonRow] });
							} catch {
								let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
								embedLog
									.setAuthor({ name: `${language_result.ticketComponentsAdd.embed_title}`, iconURL: customEmoji })
									.setDescription(language_result.ticketComponentsAdd.error_prefix)
									.setFooter({ text: `${language_result.ticketComponentsAdd.embed_footer}`, iconURL: `${language_result.ticketComponentsAdd.embed_icon_url}` })
									.setColor(0xeb4034);
								await interaction.reply({ embeds: [embedLog], ephemeral: true });
								return;
							}
							let customEmoji = await getEmojifromUrl(interaction.client, "ticket");
							embedLog
								.setAuthor({ name: `${language_result.ticketComponentsAdd.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.ticketComponentsAdd.description_embed)
								.setFooter({ text: `${language_result.ticketComponentsAdd.embed_footer}`, iconURL: `${language_result.ticketComponentsAdd.embed_icon_url}` })
								.setColor(0x1b9e31);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });

						} else {
							let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.noFoundMessage.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.noFoundMessage.description_embed)
								.setFooter({ text: `${language_result.noFoundMessage.embed_footer}`, iconURL: `${language_result.noFoundMessage.embed_icon_url}` })
								.setColor(0x4287f5);
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
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\ticket-system\\ticketcomponents.js");
			}
		});
	},
};