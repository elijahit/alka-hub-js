// Code: utils/statsServer-system/command/channelstatslist.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file channelstatslist.js
 * @module 	channelstatslist
 * @description Questo file gestisce il comando per visualizzare la lista statistiche dei canali impostate!
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emojis = require('../../../bin/data/emoji');
const { findAllLevelsRolesByGuildId } = require('../../../bin/service/DatabaseService');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('levellist')
		.setDescription('Use this command to view the set level role.')
		.setDescriptionLocalization("it", "Usa questo comando per visualizzare la lista dei ruoli impostati."),
	async execute(interaction, variables) {
		let levelList = "";

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "levels", async result => {
			try {
				if (result) {
					if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 11, false, language_result.noPermission.description_embed_no_features_by_system, 
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
						language_result.noPermission.description_embed_no_features, variables)) return;

					let levelListCheckArray = await findAllLevelsRolesByGuildId(interaction.guild.id, variables);

					levelList += `${language_result.listCommand.description_embed.replace("{0}", interaction.user)}\n\n`;
					if (levelListCheckArray.length > 0) {
						for (const value of levelListCheckArray) {
							try {
								let role;
								try {
									role = await interaction.guild.roles.fetch(value.role_id);

								} catch {
									role = "Not Found";
								}
								levelList += `\n- ID: ${value.id} | ${role} | Level: ${value.level}`;
							} catch (error) {
								levelList += "";
							}
						}
					}
					else {
						levelList += `\n**${language_result.listCommand.no_channel}**`
					}
					const embedLog = new EmbedBuilder();

					if (levelList.length > 3000) {
						const arrayString = levelList.split("\n");
						let levelListResolve = "";
						for (const string of arrayString) {
							if (levelListResolve.length < 3500) {
								levelListResolve += `\n${string}`;
							}
						}
						levelListResolve += `\n${language_result.listCommand.most_lenght}`;
						embedLog.setDescription(`## ${language_result.listCommand.embed_title}\n` + levelListResolve);
					} else {
						embedLog.setDescription(`## ${language_result.listCommand.embed_title}\n` + levelList);
					}
					embedLog
						.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
						.setThumbnail(variables.getBotFooterIcon())
						.setColor(colors.general.blue);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });


				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\levels-system\\levellist.js", variables);
			}
		});
	},
};