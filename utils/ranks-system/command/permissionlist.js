const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('permissionlist')
		.setDescription('Use this command to view the permissions assigned to a role!')
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('The role for which you want to set permission')
				.setRequired(true)
		),
	async execute(interaction) {
		let role;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'role') role = value.role;
		});

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/ranks-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLO SE IL VALORE ESISTE
		let checkSqlHash = `SELECT * FROM rank_system_permissions WHERE guildId = ? AND roleId = ?`;
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "permissionlist", async result => {
			try {
				if (result) {
					const roleDb = await readDbAllWith2Params(checkSqlHash, interaction.guild.id, role.id);
						let roleContainer = "";
						if(roleDb) {
							await roleDb.forEach(value => {
								roleContainer += `- ${value.hashRank}\n`
							});
						}
	
						let fields = [];
						if (roleContainer.length > 0) {
							fields.push({ name: `${language_result.permissionList.permissionsfield_embed}`, value: `${roleContainer}` });
						}
						else {
							fields.push({ name: `${language_result.permissionList.permissionsfield_embed}`, value: `${language_result.permissionList.permissions_empty}` });
						}
	
						let customEmoji = await getEmojifromUrl(interaction.client, "permissionlist");
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.permissionList.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.permissionList.permissions_embed
								.replace("{0}", `${role}`))
							.setFields(fields)
							.setFooter({ text: `${language_result.permissionList.embed_footer}`, iconURL: `${language_result.permissionList.embed_icon_url}` })
							.setColor(0x4287f5);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\ranks-system\\permissionlist.js");
			}
		});
	},
};