// Code: utils/reactionRole-system/command/reactionrolelist.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file reactionrolelist.js
 * @module reactionrolelist
 * @description Questo file gestisce il comando per visualizzare i ruoli reazione impostati.
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emojis = require('../../../bin/data/emoji');
const { findAllReactionsByGuildId } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionrolelist')
		.setDescription('Use this command to view the set reaction roles.'),
	async execute(interaction, variables) {
		let reactionRoleString = "";

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/reactionRole-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "autorole", async result => {
			try {
				if (result) {
					if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 5, false, language_result.noPermission.description_embed_no_features_by_system, 
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
						language_result.noPermission.description_embed_no_features, variables)) return;

					let checkReactionAlreadySet = await findAllReactionsByGuildId(interaction.guild.id, variables);

					reactionRoleString += `${language_result.listCommand.description_embed.replace("{0}", interaction.user)}\n\n`;
					if (checkReactionAlreadySet.length > 0) {
						for (const value of checkReactionAlreadySet) {
							try {
								const channel = await interaction.guild.channels.fetch(interaction.channel.id);
								const message = await channel.messages.fetch(value.message_id);
								const role = await interaction.guild.roles.fetch(value.role_id);
								reactionRoleString += `\n-${role} | ${message.url} | ${value.emoji}`;
							} catch (error) {
								reactionRoleString += "";
							}
						}
					}
					else {
						reactionRoleString += `\n**${language_result.listCommand.no_role}**`
					}
					const embedLog = new EmbedBuilder();

					if (reactionRoleString.length > 3000) {
						const arrayString = reactionRoleString.split("\n");
						let reactionRoleStringResolve = "";
						for (const string of arrayString) {
							if (reactionRoleStringResolve.length < 3500) {
								reactionRoleStringResolve += `\n${string}`;
							}
						}
						reactionRoleStringResolve += `\n${language_result.listCommand.most_lenght}`;
						embedLog.setDescription(reactionRoleStringResolve);
					} else {
						embedLog.setDescription(reactionRoleString);
					}
					embedLog
						.setAuthor({ name: `${language_result.listCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
						.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
						.setColor(colors.general.blue);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });


				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\reactionRole-system\\reactionrolelist.js", variables);
			}
		});
	},
};