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
const { findByGuildIdAndRoleIdLevelsRoles, removeLevelsRoles, createLevelsRoles } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');

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
	async execute(interaction, variables) {
		const role = interaction.options.data[0].role;
		const level = interaction.options.data[1].value;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "levels", async result => {
			try {
				if (result) {
					let checkLevelsIsPresent = await findByGuildIdAndRoleIdLevelsRoles(interaction.guild.id, role.id, variables);
					checkLevelsIsPresent = checkLevelsIsPresent?.get({ plain: true });
					

					const customEmoji = emoji.levelsSystem.levelsMaker;
					if (checkLevelsIsPresent) {
						await removeLevelsRoles({where: { guild_id: interaction.guild.id, role_id: role.id, config_id: variables.getConfigId() }});

						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.levelsCommand.description_embed_delrole.replace("{0}", role))
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					} else {
						// CONTROLLA SE L'UTENTE HA LE FUNZIONI ABILITATE PER QUESTO COMANDO E SE HA LIMITAZIONI PREMIUM RAGGIUNTE
						// SOLO PER LA CREAZIONE DEL RUOLO NEL SISTEMA DI LIVELLI (FEATURE 11)
						if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 11, true, language_result.noPermission.description_embed_no_features_by_system, 
							language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
							language_result.noPermission.description_embed_no_features)) return;

						await createLevelsRoles(interaction.guild.id, role.id, level, variables);
	
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.levelsCommand.description_embed_addrole.replace("{0}", role).replace("{1}", level))
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(colors.general.success);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					}
				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\levels-system\\levels.js", variables);
			}
		});
	},
};