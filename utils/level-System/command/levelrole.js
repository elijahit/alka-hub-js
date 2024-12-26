// Code: utils/level-system/command/levelrole.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file levelrole.js
 * @module levelrole
 * @description Questo file contiene il comando per impostare il ruolo nel sistema di livelli
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
const { findByGuildIdAndRoleIdLevelsRoles } = require('../../../bin/service/DatabaseService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('levelrole')
		.setDescription('Use this command to set your role in the level system.')
		.addRoleOption(role =>
			role
				.setName('role')
				.setDescription('The role to set when reaching a certain level')
				.setRequired(true)
		)
		.addNumberOption(level =>
			level
				.setName('level')
				.setDescription('The level to reach to have the set role')
				.setRequired(true)
		),
	async execute(interaction) {
		const role = interaction.options.data[0].role;
		const level = interaction.options.data[1].value;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "levels", async result => {
			try {
				if (result) {
					if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 11, true, language_result.noPermission.description_embed_no_features_by_system, 
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
						language_result.noPermission.description_embed_no_features)) return;

					let checkLevelsIsPresent = await findByGuildIdAndRoleIdLevelsRoles(interaction.guild.id, role.id);
					// TODO il return della funzione è sbagliato
					

					const customEmoji = emoji.levelsSystem.levelsMaker;
					if (checkLevelsIsPresent) {
						await runDb('DELETE FROM levels_roles WHERE guilds_id = ? AND roles_id = ?', interaction.guild.id, role.id);

						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.levelsCommand.description_embed_delrole.replace("{0}", role))
							.setFooter({ text: `${language_result.levelsCommand.embed_footer}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						return;
					}

					//checkRolesRelation(role.id, interaction.guild.id);

					await runDb('INSERT INTO levels_roles (guilds_id, roles_id, levels) VALUES (?, ?, ?)', interaction.guild.id, role.id, level);

					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.levelsCommand.description_embed_addrole.replace("{0}", role).replace("{1}", level))
						.setFooter({ text: `${language_result.levelsCommand.embed_footer}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
						.setColor(colors.general.success);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });


				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\levels-system\\levels.js");
			}
		});
	},
};