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
			.setRequired(true)),
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
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
						const checkAlreadyExist = await readDbAllWith1Params('SELECT * FROM welcome_message_container WHERE guildId = ?', interaction.guild.id);
						const modal = new ModalBuilder()
							.setTitle('Welcome Message | Settings')
							.setCustomId('welcomeMessageSetting');
						if (checkAlreadyExist.length > 0) {
							const descriptionDefine = new TextInputBuilder()
								.setCustomId('descriptionWelcome')
								.setLabel(language_result.welcomeModal.descriptionWelcome)
								.setStyle(TextInputStyle.Paragraph)
								.setValue(checkAlreadyExist[0].text)
							const descriptionRow = new ActionRowBuilder().addComponents(descriptionDefine);

							modal.addComponents(descriptionRow);

							await interaction.showModal(modal);
							//ESISTE GIA
						} else {
							// NON ESISTE
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