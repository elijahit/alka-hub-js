const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Use this command to set ticket access channels'),
	async execute(interaction) {

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "ticket", async result => {
			try {
				if (result) {
					const checkSql = await readDbAllWith2Params(`SELECT * from ticket_system_message WHERE initAuthorId = ? AND guildId = ?`, interaction.user.id, interaction.guild.id);
					if(checkSql) {
						await runDb(`DELETE from ticket_system_message WHERE initAuthorId = ? AND guildId = ?`, interaction.user.id, interaction.guild.id);
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
					let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.noPermission.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.noPermission.description_embed)
						.setFooter({ text: `${language_result.noPermission.embed_footer}`, iconURL: `${language_result.noPermission.embed_icon_url}` })
						.setColor(0x4287f5);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\ticket-system\\ticket.js");
			}
		});
	},
};