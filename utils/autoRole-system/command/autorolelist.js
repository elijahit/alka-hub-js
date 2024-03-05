const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autorolelist')
		.setDescription('Use this command to view the set auto roles.'),
	async execute(interaction) {
		let autoRoleString = "";

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/autoRole-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "autorole", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT autoRoleSystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					const checkRoleAlreadySet = await readDbAllWith1Params(`SELECT * from autorole_system_roles WHERE guildId = ?`, interaction.guild.id);
					
					const customEmoji = await getEmojifromUrl(interaction.client, "autorole");
					if (checkFeaturesisEnabled?.autoRoleSystem_enabled) {
						autoRoleString += `${language_result.listCommand.description_embed.replace("{0}", interaction.user)}\n\n`;
						if (checkRoleAlreadySet?.length > 0) {
							for(const value of checkRoleAlreadySet) {
								const role = await interaction.guild.roles.fetch(value.roleId);
								if(role) {
									autoRoleString += `\n- ${role}`;
								}
							};
						}
						else {
							autoRoleString += `\n**${language_result.listCommand.no_role}**`
						}

						const embedLog = new EmbedBuilder();

						if (autoRoleString.length > 3000) {
							const arrayString = autoRoleString.split("\n");
							let autoRoleStringResolve = "";
							for (const string of arrayString) {
								if (autoRoleStringResolve.length < 3500) {
									autoRoleStringResolve += `\n${string}`;
								}
							}
							autoRoleStringResolve += `\n${language_result.listCommand.most_lenght}`;
							embedLog.setDescription(autoRoleStringResolve);
						} else {
							embedLog.setDescription(autoRoleString);
						}

						embedLog
							.setAuthor({ name: `${language_result.listCommand.embed_title}`, iconURL: customEmoji })
							.setFooter({ text: `${language_result.listCommand.embed_footer}`, iconURL: `${language_result.listCommand.embed_icon_url}` })
							.setColor(0x0d495c);
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
				errorSendControls(interaction, error, interaction.client, interaction.guild, "\\autoRole-system\\autorole.js");
			}
		});
	},
};