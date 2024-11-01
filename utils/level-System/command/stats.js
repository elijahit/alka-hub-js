const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Use this command to show statistics.')
		.addUserOption(user =>
			user
				.setName('user')
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
			const checkUserIsPresent = await readDb(`SELECT * from levels WHERE guilds_id = ? AND users_id = ?`, interaction.guild.id, user.id);

			const customEmoji = emoji.levelsSystem.levelsMaker;
			if (await checkFeaturesIsEnabled(interaction.guild, 11)) {
				if (checkUserIsPresent) {

					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.levelsCommand.description_embed_stats.replace("{0}", user).replace("{1}", checkUserIsPresent.levels).replace("{2}", checkUserIsPresent.exp).replace("{3}", 75 + (25 * checkUserIsPresent.levels)))
						.setFooter({ text: language_result.levelsCommand.newLevel_footer.replace("{0}", checkUserIsPresent.minute_vocal == null ? 0 : checkUserIsPresent.minute_vocal).replace("{1}", checkUserIsPresent.message_count == null ? 0 : checkUserIsPresent.message_count), iconURL: `${language_result.levelsCommand.embed_icon_url}` })
						.setColor(colors.general.success);
					await interaction.reply({ embeds: [embedLog] });
					return;
				}

				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
					.setDescription(language_result.levelsCommand.description_embed_statsNotFound)
					.setFooter({ text: `${language_result.levelsCommand.embed_footer}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
					.setColor(colors.general.error);
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