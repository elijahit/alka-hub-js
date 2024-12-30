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
const { findAllByGuildIdStatistics } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channelstatslist')
		.setDescription('Use this command to view the set channels stats.'),
	async execute(interaction, variables) {
		let statsList = "";

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "statsServer", async result => {
			try {
				if (result) {
					if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 6, false, language_result.noPermission.description_embed_no_features_by_system, 
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
						language_result.noPermission.description_embed_no_features, variables)) return;

					let statsListCheckArray = await findAllByGuildIdStatistics(interaction.guild.id);

					statsList += `${language_result.listCommand.description_embed.replace("{0}", interaction.user)}\n\n`;
					if (statsListCheckArray.length > 0) {
						for (const value of statsListCheckArray) {
							try {
								let channel;
								try {
									channel = await interaction.guild.channels.fetch(value.channel_id);

								} catch {
									channel = "Not Found";
								}
								statsList += `\n- ID: ${value.id} | ${channel} | ${value.channel_name}`;
							} catch (error) {
								statsList += "";
							}
						}
					}
					else {
						statsList += `\n**${language_result.listCommand.no_channel}**`
					}
					const embedLog = new EmbedBuilder();

					if (statsList.length > 3000) {
						const arrayString = statsList.split("\n");
						let statsListResolve = "";
						for (const string of arrayString) {
							if (statsListResolve.length < 3500) {
								statsListResolve += `\n${string}`;
							}
						}
						statsListResolve += `\n${language_result.listCommand.most_lenght}`;
						embedLog.setDescription(statsListResolve);
					} else {
						embedLog.setDescription(statsList);
					}
					embedLog
						.setAuthor({ name: `${language_result.listCommand.embed_title}`, iconURL: emojis.statsServerSystem.main })
						.setFooter({ text: Variables.getBotFooter(), iconURL: Variables.getBotFooterIcon() })
						.setColor(colors.general.blue);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });


				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\statsServer-system\\channelstatslist.js");
			}
		});
	},
};