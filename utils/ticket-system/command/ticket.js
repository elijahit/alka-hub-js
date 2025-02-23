const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { findByGuildAndAuthorIdTicketMessages, removeTicketMessages } = require('../../../bin/service/DatabaseService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Use this command to set ticket access channels')
		.setDescriptionLocalization("it", "Usa questo comando per impostare i canali di accesso ai ticket"),
	async execute(interaction, variables) {

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);

		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "ticket", async result => {
			try {
				if (result) {

					if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 2, false, language_result.noPermission.description_embed_no_features_by_system, 
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
						language_result.noPermission.description_embed_no_features, variables)) return;

					let checkSql = await findByGuildAndAuthorIdTicketMessages(interaction.guild.id, interaction.user.id, variables);
					checkSql = checkSql?.get({ plain: true });
					if (checkSql && checkSql.message_id == null && checkSql.channel_id == null) {
						await removeTicketMessages(checkSql.id, variables);
					}

					const modal = new ModalBuilder()
						.setCustomId("ticketModal")
						.setTitle(language_result.messageChannel.embed_title);

					const ticketTitle = new TextInputBuilder()
						.setCustomId('ticketModalTitle')
						.setLabel(language_result.messageChannel.modalTitleDescription)
						.setPlaceholder(language_result.messageChannel.modalTitlePlaceHolder)
						.setStyle(TextInputStyle.Short);

					const ticketDescription = new TextInputBuilder()
						.setCustomId('ticketModalDescription')
						.setLabel(language_result.messageChannel.modalDescriptionDescription)
						.setPlaceholder(language_result.messageChannel.modalDescriptionPlaceHolder)
						.setStyle(TextInputStyle.Paragraph);

					const ticketTitleRow = new ActionRowBuilder().addComponents(ticketTitle);
					const ticketDescriptionRow = new ActionRowBuilder().addComponents(ticketDescription);

					modal.addComponents(ticketTitleRow, ticketDescriptionRow);

					await interaction.showModal(modal);


				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\ticket-system\\ticket.js", variables);
			}
		});
	},
};