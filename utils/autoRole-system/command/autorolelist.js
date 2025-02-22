const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { errorSendControls, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { findAllAutoRolesByGuildId } = require('../../../bin/service/DatabaseService');
const color = require('../../../bin/data/colors');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autorolelist')
		.setDescription('Use this command to view the set auto roles.')
		.setDescriptionLocalization("it", "Usa questo comando per visualizzare i ruoli auto impostati."),
	async execute(interaction, variables) {
		let autoRoleString = "";

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/autoRole-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "autorole", async result => {
			try {
				if (result) {
					let checkRoleAlreadySet = await findAllAutoRolesByGuildId(interaction.guild.id, variables);

					autoRoleString += `${language_result.listCommand.description_embed.replace("{0}", interaction.user)}\n\n`;
					if (checkRoleAlreadySet?.length > 0) {
						for (let value of checkRoleAlreadySet) {
							value = value.get({ plain: true });
							const role = await interaction.guild.roles.fetch(value.role_id);
							if (role) {
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
						embedLog.setDescription(`## ${language_result.listCommand.embed_title}\n${autoRoleStringResolve}`);
					} else {
						embedLog.setDescription(`## ${language_result.listCommand.embed_title}\n${autoRoleString}`);
					}

					embedLog
						.setFooter({ text: `${language_result.listCommand.embed_footer}`, iconURL: `${variables.getBotFooterIcon()}` })
						.setColor(color.general.olive)
						.setThumbnail(variables.getBotFooterIcon());
					await interaction.reply({ embeds: [embedLog], flag: 64 });
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\autoRole-system\\autorole.js", variables);
			}
		});
	},
};