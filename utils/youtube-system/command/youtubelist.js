const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('youtubelist')
		.setDescription('Use this command to display all listening youtube channels'),
	async execute(interaction) {
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/twitch-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLO SE IL VALORE ESISTE
		let checkSqlHash = `SELECT * FROM twitch_notify_system WHERE guildId = ?`;
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "twitchNotify", async result => {
			try {
				if (result) {
					const twtichNotify = await readDbAllWith1Params(checkSqlHash, interaction.guild.id);
					let notifyContainer = "";
					if (twtichNotify) {
						for await (const value of twtichNotify) {
							try {
								const channel = await interaction.guild.channels.fetch(value.channelId);
								notifyContainer += `- ${value.streamerName} | ${channel}\n`

							}
							catch {
								const errorCheck = new Error(error);
								if (errorCheck.message == "DiscordAPIError[10003]: Unknown Channel") {
									await runDb('DELETE FROM twitch_notify_system WHERE guildId = ? AND channelId = ?', interaction.guild.id, value.channelId);
								}
							}
						}
					}

					let fields = [];
					if (notifyContainer.length > 0) {
						fields.push({ name: `${language_result.notifyList.permissionsfield_embed}`, value: `${notifyContainer}` });
					}
					else {
						fields.push({ name: `${language_result.notifyList.permissionsfield_embed}`, value: `${language_result.notifyList.permissions_empty}` });
					}

					let customEmoji = await getEmojifromUrl(interaction.client, "twitch");
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.notifyList.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.notifyList.permissions_embed)
						.setFields(fields)
						.setFooter({ text: `${language_result.notifyList.embed_footer}`, iconURL: `${language_result.notifyList.embed_icon_url}` })
						.setColor(0x4287f5);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\twitch-system\twitchlist.js");
			}
		});
	},
};