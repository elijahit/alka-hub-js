const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('features')
		.setDescription('Use this command to enable or disable the features')
		.addStringOption(option =>
			option
				.addChoices({
					name: "Logs System",
					value: "is_enabled_logs",
				})
				.addChoices({
					name: "Ticket System",
					value: "is_enabled_ticket",
				})
				.addChoices({
					name: "Auto Voice System",
					value: "is_enabled_autovoice",
				})
				.addChoices({
					name: "Auto Role System",
					value: "is_enabled_autorole",
				})
				.addChoices({
					name: "Reaction Role System",
					value: "is_enabled_reactionrole",
				})
				.addChoices({
					name: "Stats Server System",
					value: "is_enabled_stastserver",
				})
				.addChoices({
					name: "Twitch Notify System",
					value: "is_enabled_twitchnotify",
				})
				.addChoices({
					name: "Giveaway System",
					value: "is_enabled_giveaway",
				})
				.addChoices({
					name: "Welcome Message System",
					value: "is_enabled_welcome",
				})
				.addChoices({
					name: "Levels System",
					value: "is_enabled_levels",
				})
				.setName('choices')
				.setDescription('Name of the system you want to enable or disable')
				.setRequired(true)
		),
	async execute(interaction) {
		const nameChoices = interaction.options.data[0].value;
		let nameFormatted;

		switch(nameChoices) {
			case "is_enabled_logs":
				nameFormatted = "Logs System";
				break;
			case "is_enabled_ticket":
				nameFormatted = "Ticket System";
				break;
			case "is_enabled_autovoice":
				nameFormatted = "Auto Voice System";
				break;
			case "is_enabled_autorole":
				nameFormatted = "Auto Role System";
				break;
			case "is_enabled_reactionrole":
				nameFormatted = "Reaction Role System";
				break;
			case "is_enabled_stastserver":
				nameFormatted = "Stats Server System";
				break;
			case "is_enabled_twitchnotify":
				nameFormatted = "Twitch Notify System";
				break;
			case "is_enabled_giveaway":
				nameFormatted = "Giveaway System";
				break;
			case "is_enabled_welcome": 
				nameFormatted = "Welcome Message System";
				break;
			case "is_enabled_levels":
				nameFormatted = "Levels System";
				break;
			default:
				nameFormatted = "Undefined";
				break;
		}

		

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/general/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "features", async result => {
			try {
				if (result) {
					const checkQuery = `SELECT ${nameChoices} FROM guilds WHERE guilds_id = ?`
					const checkFeature = await readDb(checkQuery, interaction.guild.id);

					if (checkFeature) {
						let updateSql = `UPDATE guilds SET ${nameChoices} = ? WHERE guilds_id = ?`
						if (checkFeature.is_enabled_logs == 1) {
							await runDb(updateSql, 0, interaction.guild.id);
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.disabledFeatures.embed_title}`, iconURL: emoji.general.falseMaker })
								.setDescription(language_result.disabledFeatures.description_embed.replace("{0}", nameFormatted))
								.setFooter({ text: `${language_result.disabledFeatures.embed_footer}`, iconURL: `${language_result.disabledFeatures.embed_icon_url}` })
								.setColor(colors.general.error);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
						} else {
							await runDb(updateSql, 1, interaction.guild.id);
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.enabledFeatures.embed_title}`, iconURL: emoji.general.trueMaker })
								.setDescription(language_result.enabledFeatures.description_embed.replace("{0}", nameFormatted))
								.setFooter({ text: `${language_result.enabledFeatures.embed_footer}`, iconURL: `${language_result.enabledFeatures.embed_icon_url}` })
								.setColor(colors.general.success);
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