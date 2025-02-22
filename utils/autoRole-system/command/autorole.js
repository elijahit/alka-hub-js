const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { errorSendControls, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { autoRolesFindByRoleId, autoRolesRemove, createAutoRoles } = require('../../../bin/service/DatabaseService');
const color = require('../../../bin/data/colors');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autorole')
		.setDescription('Use this command to set roles to assign upon a user\'s join.')
		.setDescriptionLocalization("it", "Usa questo comando per impostare i ruoli da assegnare al join di un utente.")
		.addRoleOption(role =>
			role
				.setName('role')
				.setDescription('The role to insert into the list autorole')
				.setDescriptionLocalization("it", "Il ruolo da inserire nella lista autorole")
				.setRequired(true)
		),
	async execute(interaction, variables) {
		const role = interaction.options.data[0].role;
		const roleId = interaction.options.data[0].value;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/autoRole-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "autorole", async result => {
			try {
				if (result) {
					if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 4, true, language_result.noPermission.description_embed_no_features_by_system,
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
						language_result.noPermission.description_embed_no_features, variables)) return;

					let checkRoleAlreadySet = await autoRolesFindByRoleId(roleId, variables);
					checkRoleAlreadySet = checkRoleAlreadySet?.get({ plain: true });

					// CONTROLLO SE IL RUOLO SI TROVA SOTTO AL RUOLO DA IMPOSTARE
					if (interaction.guild.roles.botRoleFor(interaction.client.user).rawPosition < role.rawPosition) {
						const embedLog = new EmbedBuilder()
							.setDescription(`###${language_result.addCommand.embed_title}\n${language_result.addCommand.description_embed_missingpermissions.replace("{0}", `${interaction.guild.roles.botRoleFor(interaction.client.user)}`)}`)
							.setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
							.setColor(color.general.error)
							.setThumbnail(variables.getBotFooterIcon());
						await interaction.reply({ embeds: [embedLog],  flags: 64 });
						return;
					}
					if (checkRoleAlreadySet) {
						await autoRolesRemove(roleId, variables);

						const embedLog = new EmbedBuilder()
							.setDescription(`### ${language_result.addCommand.embed_title}\n${language_result.addCommand.description_embed_delete.replace("{0}", `${role}`)}`)
							.setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
							.setColor(color.general.error)
							.setThumbnail(variables.getBotFooterIcon());
						await interaction.reply({ embeds: [embedLog],  flags: 64 });
						return;
					}
					await createAutoRoles(roleId, interaction.guild.id, variables);

					const embedLog = new EmbedBuilder()
						.setDescription(`### ${language_result.addCommand.embed_title}\n${language_result.addCommand.description_embed.replace("{0}", `${role}`)}`)
						.setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
						.setColor(color.general.success)
						.setThumbnail(variables.getBotFooterIcon());
					await interaction.reply({ embeds: [embedLog],  flags: 64 });

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