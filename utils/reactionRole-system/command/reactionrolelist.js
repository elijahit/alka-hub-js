const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, readDbAllWith1Params, readDbAll } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emojis = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionrolelist')
		.setDescription('Use this command to view the set reaction roles.'),
	async execute(interaction) {
		let reactionRoleString = "";

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/reactionRole-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "autorole", async result => {
			try {
				if (result) {

					const checkReactionAlreadySet = await readDbAll(`SELECT * 
					FROM reaction_roles rs
					JOIN roles r ON r.roles_id = rs.roles_id
					WHERE r.guilds_id = ?`, interaction.guild.id);

					if (await checkFeaturesIsEnabled(interaction.guild, 5)) {
						reactionRoleString += `${language_result.listCommand.description_embed.replace("{0}", interaction.user)}\n\n`;
						if (checkReactionAlreadySet?.length > 0) {
							for (const value of checkReactionAlreadySet) {
								try {
									const channel = await interaction.guild.channels.fetch(interaction.channel.id);
									const message = await channel.messages.fetch(value.message_id);
									const role = await interaction.guild.roles.fetch(value.roles_id);
									reactionRoleString += `\n-${role} | ${message.url} | ${value.emoji}`;
								} catch {
									reactionRoleString += "";
								}
							};
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
							.setFooter({ text: `${language_result.listCommand.embed_footer}`, iconURL: `${language_result.listCommand.embed_icon_url}` })
							.setColor(colors.general.blue);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });

					} else {
						await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\reactionRole-system\\reactionrolelist.js");
			}
		});
	},
};