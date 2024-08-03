const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Use this command to show statistics.')
		.addUserOption(user =>
			user
				.setName('channel')
				.setDescription('Add a user to see someone else\'s statistics')
				.setRequired(true)
		),
	async execute(interaction) {
		const user = interaction.options.data[0].user;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		try {
			const checkFeaturesisEnabled = await readDb(`SELECT levelsSystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

			const checkUserIsPresent = await readDbAllWith2Params(`SELECT * from levels_server_users WHERE guild_id = ? AND user_id = ?`, interaction.guild.id, user.id);

			const customEmoji = await getEmojifromUrl(interaction.client, "levels");
			if (checkFeaturesisEnabled?.levelsSystem_enabled) {
				if (checkUserIsPresent?.length > 0) {

					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.levelsCommand.description_embed_stats.replace("{0}", user).replace("{1}", checkUserIsPresent[0].level).replace("{2}", checkUserIsPresent[0].exp).replace("{3}", 75 + (25 * checkUserIsPresent[0].level)))
						.setFooter({ text: language_result.levelsCommand.newLevel_footer.replace("{0}", checkUserIsPresent[0].minute_vocal).replace("{1}", checkUserIsPresent[0].message_count), iconURL: `${language_result.levelsCommand.embed_icon_url}` })
						.setColor(0x7a090c);
					await interaction.reply({ embeds: [embedLog] });
					return;
				}

				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
					.setDescription(language_result.levelsCommand.description_embed_statsNotFound)
					.setFooter({ text: `${language_result.levelsCommand.embed_footer}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
					.setColor(0x03fc28);
				await interaction.reply({ embeds: [embedLog], ephemeral: true });
			}
			else {
				await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
			}
		}
		catch (error) {
			console.log(error)
			errorSendControls(error, interaction.client, interaction.guild, "\\levels-system\\stats.js");
		}
	},
};