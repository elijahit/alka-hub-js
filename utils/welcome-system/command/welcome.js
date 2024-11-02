const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

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
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		const color = interaction.options.getNumber('color');
		const background = interaction.options.getString('background');
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/welcome-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "welcome", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT welcomeMessage_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					if (checkFeaturesisEnabled?.welcomeMessage_enabled) {
						//ESISTE GIA
						const checkAlreadyExist = await readDbAllWith1Params('SELECT * FROM welcome_message_container WHERE guildId = ?', interaction.guild.id);
						const modal = new ModalBuilder()
							.setTitle('Welcome Message | Settings')
							.setCustomId('welcomeMessageSetting');
						if (checkAlreadyExist.length > 0) {
							// DEFINISCO LA DESCRIZIONE
							let checkText = checkAlreadyExist[0].text ? checkAlreadyExist[0].text : "";
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
							await runDb('UPDATE welcome_message_container SET channelId = ?, color = ? WHERE guildId = ?', channel.id, color, interaction.guild.id);

							if(background) {
								await runDb('UPDATE welcome_message_container SET backgroundUrl = ? WHERE guildId = ?',background, interaction.guild.id);
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
							await runDb('INSERT INTO welcome_message_container (guildId, channelId, color) VALUES(?,?,?)', interaction.guild.id, channel.id, color);

							if(background) {
								await runDb('UPDATE welcome_message_container SET backgroundUrl = ? WHERE guildId = ?',background, interaction.guild.id);
							}

							await interaction.showModal(modal);
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
				errorSendControls(error, interaction.client, interaction.guild, "\\welcome-system\\welcome.js");
			}
		});
	},
};