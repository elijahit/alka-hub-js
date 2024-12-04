const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const { checkFeatureEnabled } = require('../../../bin/repository/Feature');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('features')
		.setDescription('Use this command to enable or disable the features')
		.addIntegerOption(option =>
			option
				.addChoices({
					name: "Logs System",
					value: 1,
				})
				.addChoices({
					name: "Ticket System",
					value: 2,
				})
				.addChoices({
					name: "Auto Voice System",
					value: 3,
				})
				.addChoices({
					name: "Auto Role System",
					value: 4,
				})
				.addChoices({
					name: "Reaction Role System",
					value: 5,
				})
				.addChoices({
					name: "Stats Server System",
					value: 6,
				})
				.addChoices({
					name: "Twitch Notify System",
					value: 7,
				})
				.addChoices({
					name: "Youtube Notify System",
					value: 8,
				})
				.addChoices({
					name: "Giveaway System",
					value: 9,
				})
				.addChoices({
					name: "Welcome Message System",
					value: 10,
				})
				.addChoices({
					name: "Levels System",
					value: 11,
				})
				.setName('choices')
				.setDescription('Name of the system you want to enable or disable')
				.setRequired(true)
		),
	async execute(interaction) {
		const featuresChoice = interaction.options.data[0].value;
		
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/general/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "features", async result => {
			try {
				if (result) {
					const checkQuery = `SELECT * FROM guild_enabled_features WHERE guilds_id = ? AND feature_id = ?`;
					const nameQuery = `SELECT feature_name FROM features WHERE feature_id = ?`;
					// const checkFeature = await checkFeatureEnabled(interaction.guild.id, featuresChoice);
					// console.log(checkFeature);
					return;
					const checkName = await readDb(nameQuery, featuresChoice);
					
					if (checkFeature) {
						let updateSql = `UPDATE guild_enabled_features SET is_enabled = ? WHERE guilds_id = ? AND feature_id = ?`;
						if (checkFeature.is_enabled == 1) {
							await runDb(updateSql, 0, interaction.guild.id, featuresChoice);
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.disabledFeatures.embed_title}`, iconURL: emoji.general.falseMaker })
								.setDescription(language_result.disabledFeatures.description_embed.replace("{0}", checkName.feature_name))
								.setFooter({ text: `${language_result.disabledFeatures.embed_footer}`, iconURL: `${language_result.disabledFeatures.embed_icon_url}` })
								.setColor(colors.general.error);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
						} else {
							await runDb(updateSql, 1, interaction.guild.id, featuresChoice);
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.enabledFeatures.embed_title}`, iconURL: emoji.general.trueMaker })
								.setDescription(language_result.enabledFeatures.description_embed.replace("{0}", checkName.feature_name))
								.setFooter({ text: `${language_result.enabledFeatures.embed_footer}`, iconURL: `${language_result.enabledFeatures.embed_icon_url}` })
								.setColor(colors.general.success);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
						}
					} else {
							await runDb("INSERT INTO guild_enabled_features (guilds_id, feature_id, is_enabled) VALUES(?, ?, ?)", interaction.guild.id, featuresChoice, 1);
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.enabledFeatures.embed_title}`, iconURL: emoji.general.trueMaker })
								.setDescription(language_result.enabledFeatures.description_embed.replace("{0}", checkName.feature_name))
								.setFooter({ text: `${language_result.enabledFeatures.embed_footer}`, iconURL: `${language_result.enabledFeatures.embed_icon_url}` })
								.setColor(colors.general.success);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
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