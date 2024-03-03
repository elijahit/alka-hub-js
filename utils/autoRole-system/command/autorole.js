const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autorole')
		.setDescription('Use this command to set roles to assign upon a user\'s join.')
		.addRoleOption(role =>
			role
				.setName('role')
				.setDescription('The role to insert into the list autorole')
				.setRequired(true)
		),
	async execute(interaction) {
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
					const checkFeaturesisEnabled = await readDb(`SELECT autoRoleSystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					const checkRoleAlreadySet = await readDbAllWith2Params(`SELECT * from autorole_system_roles WHERE guildId = ? AND roleId = ?`, interaction.guild.id, roleId);

					if (checkFeaturesisEnabled?.autoRoleSystem_enabled) {
						if (checkRoleAlreadySet?.length > 0) {
							await runDb('INSERT INTO autorole_system_roles (guildId, roleId) VALUES (?, ?)', interaction.guild.id, roleId);
	
							const customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.addCommand.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.addCommand.description_embed_error.replace("{0}", role))
								.setFooter({ text: `${language_result.addCommand.embed_footer}`, iconURL: `${language_result.addCommand.embed_icon_url}` })
								.setColor(0x7a090c);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
							return;
						}
						await runDb('INSERT INTO autorole_system_roles (guildId, roleId) VALUES (?, ?)', interaction.guild.id, roleId);

						const customEmoji = await getEmojifromUrl(interaction.client, "autorole");
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.addCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.addCommand.description_embed.replace("{0}", role))
							.setFooter({ text: `${language_result.addCommand.embed_footer}`, iconURL: `${language_result.addCommand.embed_icon_url}` })
							.setColor(0x03fc28);
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
				errorSendControls(error, interaction.client, interaction.guild, "\\autoRole-system\\autorole.js");
			}
		});
	},
};