// Code: utils/level-system/command/stats.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file stats.js
 * @module stats
 * @description Questo file contiene il comando per visualizzare le statistiche
 */

const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { findByGuildIdAndUserIdLevel } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Use this command to show statistics.')
		.setDescriptionLocalization("it", "Usa questo comando per visualizzare le statistiche")
		.addUserOption(user =>
			user
				.setName('user')
				.setDescription('Add a user to see someone else\'s statistics')
				.setDescriptionLocalization("it", "Aggiungi un utente per vedere le statistiche di qualcun altro")
				.setRequired(true)
		),
	async execute(interaction, variables) {
		const user = interaction.options.data[0].user;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		try {
			if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 11, false, language_result.noPermission.description_embed_no_features_by_system,
				language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
				language_result.noPermission.description_embed_no_features, variables)) return;

			let checkUserIsPresent = await findByGuildIdAndUserIdLevel(interaction.guild.id, user.id, variables);
			checkUserIsPresent = checkUserIsPresent?.get({ plain: true });

			const customEmoji = emoji.levelsSystem.levelsMaker;

			if (checkUserIsPresent) {

				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
					.setDescription(language_result.levelsCommand.description_embed_stats.replace("{0}", user).replace("{1}", checkUserIsPresent.level).replace("{2}", checkUserIsPresent.exp).replace("{3}", 75 + (25 * checkUserIsPresent.level)))
					.setFooter({ text: language_result.levelsCommand.newLevel_footer.replace("{0}", checkUserIsPresent.minute_vocal == null ? 0 : checkUserIsPresent.minute_vocal).replace("{1}", checkUserIsPresent.message_count == null ? 0 : checkUserIsPresent.message_count), iconURL: variables.getBotFooterIcon() })
					.setColor(colors.general.success);
				await interaction.reply({ embeds: [embedLog] });
				return;
			}

			const embedLog = new EmbedBuilder()
				.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
				.setDescription(language_result.levelsCommand.description_embed_statsNotFound)
				.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
				.setColor(colors.general.error);
			await interaction.reply({ embeds: [embedLog], ephemeral: true });
		}
		catch (error) {
			console.log(error)
			errorSendControls(error, interaction.client, interaction.guild, "\\levels-system\\stats.js", variables);
		}
	},
};