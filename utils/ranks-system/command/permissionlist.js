// Code: utils/ranks-system/command/permissionlist.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file permissionlist.js
 * @module permissionlist
 * @description Questo file gestisce il comando per visualizzare i permessi assegnati ad un ruolo!
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDbAll } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('permissionlist')
		.setDescription('Use this command to view the permissions assigned to a role!')
		.setDescriptionLocalization("it", "Usa questo comando per visualizzare i permessi assegnati ad un ruolo!")
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('The role for which you want to set permission')
				.setDescriptionLocalization("it", "Il ruolo per il quale vuoi impostare i permessi")
				.setRequired(true)
		),
	async execute(interaction, variables) {
		let role;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'role') role = value.role;
		});

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/ranks-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLO SE IL VALORE ESISTE
		let checkSqlHash = `SELECT r.roles_id, r.guilds_id, h.hash_name
		FROM roles r
		JOIN roles_hash rh ON rh.roles_id = r.roles_id
		JOIN hash h ON rh.hash_id = h.hash_id
		WHERE r.guilds_id = ? AND r.roles_id = ?`;
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "permissionlist", async result => {
			try {
				if (result) {
					const roleDb = await readDbAll(checkSqlHash, interaction.guild.id, role.id);
						let roleContainer = "";
						if(roleDb) {
							roleDb.forEach(value => {
								roleContainer += `- ${value.hash_name}\n`
							});
						}
	
						let fields = [];
						if (roleContainer.length > 0) {
							fields.push({ name: `${language_result.permissionList.permissionsfield_embed}`, value: `${roleContainer}` });
						}
						else {
							fields.push({ name: `${language_result.permissionList.permissionsfield_embed}`, value: `${language_result.permissionList.permissions_empty}` });
						}
	
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.permissionList.embed_title}`, iconURL: emoji.permissions.list })
							.setDescription(language_result.permissionList.permissions_embed
								.replace("{0}", `${role}`))
							.setFields(fields)
							.setFooter({ text: `${language_result.permissionList.embed_footer}`, iconURL: `${language_result.permissionList.embed_icon_url}` })
							.setColor(colors.general.blue);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\ranks-system\\permissionlist.js");
			}
		});
	},
};