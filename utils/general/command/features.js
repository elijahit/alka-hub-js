const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('features')
		.setDescription('Use this command to enable or disable the features')
		.addStringOption(option =>
			option
				.addChoices({
					name: "Logs System",
					value: "logSystem_enabled",
				})
				.addChoices({
					name: "Ticket System",
					value: "ticketSystem_enabled",
				})
				.addChoices({
					name: "Auto Voice System",
					value: "autoVoiceSystem_enabled",
				})
				.addChoices({
					name: "Auto Role System",
					value: "autoRoleSystem_enabled",
				})
				.addChoices({
					name: "Reaction Role System",
					value: "reactionRoleSystem_enabled",
				})
				.addChoices({
					name: "Stats Server System",
					value: "statsServerSystem_enabled",
				})
				.addChoices({
					name: "Twitch Notify System",
					value: "twitchNotifySystem_enabled",
				})
				.addChoices({
					name: "Giveaway System",
					value: "giveawaySystem_enabled",
				})
				.addChoices({
					name: "Welcome Message System",
					value: "welcomeMessage_enabled",
				})
				.addChoices({
					name: "Levels System",
					value: "levelsSystem_enabled",
				})
				.setName('choices')
				.setDescription('Name of the system you want to enable or disable')
				.setRequired(true)
		),
	async execute(interaction) {
		let choices, nameChoices;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'choices') {
				choices = value.value;
				nameChoices = value.value.split("_")[0];
			} 
		});

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/general/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "features", async result => {
			try {
				if (result) {
					const checkQuery = `SELECT ${choices} FROM guilds_config WHERE guildId = ?`
					const checkFeature = await readDb(checkQuery, interaction.guild.id);

					if (checkFeature != undefined) {
						let updateSql = `UPDATE guilds_config SET ${choices} = ? WHERE guildId = ?`
						if (checkFeature[choices] == 1) {
							let customEmoji = await getEmojifromUrl(interaction.client, "pexremoved");
							await runDb(updateSql, null, interaction.guild.id);
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.disabledFeatures.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.disabledFeatures.description_embed.replace("{0}", nameChoices))
								.setFooter({ text: `${language_result.disabledFeatures.embed_footer}`, iconURL: `${language_result.disabledFeatures.embed_icon_url}` })
								.setColor(0xab2c09);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
						} else {
							let customEmoji = await getEmojifromUrl(interaction.client, "pexadd");
							await runDb(updateSql, 1, interaction.guild.id);
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.enabledFeatures.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.enabledFeatures.description_embed.replace("{0}", nameChoices))
								.setFooter({ text: `${language_result.enabledFeatures.embed_footer}`, iconURL: `${language_result.enabledFeatures.embed_icon_url}` })
								.setColor(0x119c05);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
						}
					} else {
						await noInitGuilds(interaction);
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\general\\features.js");
			}
		});
	},
};