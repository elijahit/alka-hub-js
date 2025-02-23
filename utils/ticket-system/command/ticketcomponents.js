const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { errorSendControls, returnPermission, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const color = require('../../../bin/data/colors');
const { findByMessageIdTicketMessages } = require('../../../bin/service/DatabaseService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticketcomponents')
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription("Provide the ID of the ticket message")
				.setDescriptionLocalization("it", "Fornisci l'ID del messaggio del ticket")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("prefix")
				.setDescription("Provide the prefix (UNIQUE) of the ticket message")
				.setDescriptionLocalization("it", "Fornisci il prefisso (UNICO) del messaggio del ticket")
				.setRequired(true)
				.setMaxLength(3)
		)
		.addStringOption(option =>
			option
				.setName("label")
				.setDescription("Provide the name of the component")
				.setDescriptionLocalization("it", "Fornisci il nome del componente")
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
				.setDescriptionLocalization("it", "Fornisci lo stile del componente")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("emoji")
				.setDescription("Provide the emoji of the component")
				.setDescriptionLocalization("it", "Fornisci l'emoji del componente")
				.setRequired(false)
		)
		.setDescription('Use this command to set the ticket components')
		.setDescriptionLocalization("it", "Usa questo comando per impostare i componenti del ticket"),
	async execute(interaction, variables) {
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
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);

		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "ticket", async result => {
			try {
				if (result) {
					if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 2, false, language_result.noPermission.description_embed_no_features_by_system,
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
						language_result.noPermission.description_embed_no_features, variables)) return;

					let checkMessageOnDb =  await findByMessageIdTicketMessages(messageChoice, variables);
					checkMessageOnDb = checkMessageOnDb?.get({ plain: true });

					let message;
					try {
						message = await interaction.channel.messages.fetch(messageChoice);
					} catch {
						message = undefined;
					}

					if (checkMessageOnDb && message) {
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
							embedLog
								.setDescription(`## ${language_result.ticketComponentsAdd.embed_title}\n` + language_result.ticketComponentsAdd.error_prefix)
								.setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
								.setColor(color.general.error)
								.setThumbnail(variables.getBotFooterIcon());
							await interaction.reply({ embeds: [embedLog], flags: 64 });
							return;
						}
						embedLog
							.setDescription(`## ${language_result.ticketComponentsAdd.embed_title}\n` + language_result.ticketComponentsAdd.description_embed)
							.setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
							.setColor(color.general.success)
							.setThumbnail(variables.getBotFooterIcon());
						await interaction.reply({ embeds: [embedLog], flags: 64 });

					} else {
						const embedLog = new EmbedBuilder()
							.setDescription(`## ${language_result.noFoundMessage.embed_title}\n` + language_result.noFoundMessage.description_embed)
							.setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
							.setColor(color.general.error)
							.setThumbnail(variables.getBotFooterIcon());
						await interaction.reply({ embeds: [embedLog], flags: 64 });
					}



				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\ticket-system\\ticketcomponents.js", variables);
			}
		});
	},
};