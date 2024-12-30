// Code: utils/welcome-system/command/welcome.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file welcome.js
 * @module welcome
 * @description Questo file gestisce il comando per impostare i messaggi di benvenuto!
 */

const { SlashCommandBuilder, ActionRowBuilder, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { errorSendControls, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { findByGuildIdWelcome, updateWelcome, createWelcome } = require('../../../bin/service/DatabaseService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('welcome')
		.setDescription('Use this command to set your welcome messages')
		.addChannelOption(value =>
			value
				.setName('channel')
				.setDescription('Channel in which to see the message')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true)
		)
		.addNumberOption(value =>
			value
				.setName('color')
				.setRequired(true)
				.setDescription('Color of your font')
				.addChoices({
					name: "White",
					value: 0
				})
				.addChoices({
					name: "Black",
					value: 1
				})
		)
		.addStringOption(value =>
			value
				.setName("background")
				.setDescription('Link .jpg or .png image to use as background')
		),
	async execute(interaction, variables) {
		const channel = interaction.options.getChannel('channel');
		const color = interaction.options.getNumber('color');
		const background = interaction.options.getString('background');
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/welcome-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "welcome", async result => {
			try {
				if (result) {
					if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 10, false, language_result.noPermission.description_embed_no_features_by_system,
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
						language_result.noPermission.description_embed_no_features)) return;

					//ESISTE GIA
					let checkAlreadyExist = await findByGuildIdWelcome(interaction.guild.id);
					checkAlreadyExist = checkAlreadyExist?.get({ plain: true });

					const modal = new ModalBuilder()
						.setTitle('Welcome Message | Settings')
						.setCustomId('welcomeMessageSetting');
					if (checkAlreadyExist) {
						// DEFINISCO LA DESCRIZIONE
						let checkText = checkAlreadyExist.text ? checkAlreadyExist.text : "";
						const descriptionDefine = new TextInputBuilder()
							.setCustomId('descriptionWelcome')
							.setLabel(language_result.welcomeModal.descriptionWelcome)
							.setRequired(false)
							.setStyle(TextInputStyle.Paragraph)
							.setValue(checkText)
						const descriptionRow = new ActionRowBuilder().addComponents(descriptionDefine);
						// END DESCRIZIONE


						modal.addComponents(descriptionRow);

						// AGGIORNO IL CANALE NEL DATABASE
						await updateWelcome({ channel_id: channel.id, color: color }, {where: { guild_id: interaction.guild.id }});

						if (background) {
							await updateWelcome({ background_url: background }, {where: { guild_id: interaction.guild.id }});
						}

						await interaction.showModal(modal);
					} else {
						// DEFINISCO LA DESCRIZIONE
						const descriptionDefine = new TextInputBuilder()
							.setCustomId('descriptionWelcome')
							.setLabel(language_result.welcomeModal.descriptionWelcome)
							.setRequired(false)
							.setStyle(TextInputStyle.Paragraph)
						const descriptionRow = new ActionRowBuilder().addComponents(descriptionDefine);
						// END DESCRIZIONE


						modal.addComponents(descriptionRow);

						// INSERISCO IL CANALE NEL DATABASE
						await createWelcome(interaction.guild.id, channel.id, color, background, "");

						if (background) {
							await updateWelcome({ background_url: background }, {where: { guild_id: interaction.guild.id }});
						}

						await interaction.showModal(modal);
					}


				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\welcome-system\\welcome.js");
			}
		});
	},
};