// Code: utils/ranks-system/command/permissions.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file permissions.js
 * @module permissions
 * @description Questo file gestisce il comando per assegnare o rimuovere livelli di accesso basati sui ruoli!
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbWith3Params, readDbAllWithValue, runDb, readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('permissions')
		.setDescription('Use the following command to set or remove role-based access levels!')
		.setDescriptionLocalization("it", "Usa il seguente comando per assegnare o rimuovere livelli di accesso basati sui ruoli!")
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('The role for which you want to set permission')
				.setDescriptionLocalization("it", "Il ruolo per il quale vuoi impostare i permessi")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('pex')
				.setDescription('Hash of the command to assign permissions to')
				.setDescriptionLocalization("it", "Hash del comando a cui assegnare i permessi")
				.setRequired(true)
		)
		.setDefaultMemberPermissions(8),
	async execute(interaction, variables) {
		let role, pex;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'role') role = value.role;
			if (value.name == 'pex') pex = value.value;
		});

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/ranks-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);

		// CONTROLLO SE IL RANK ESISTE
		const checkPermissions = `SELECT p.permissions_name, h.hash_id, r.roles_id, r.guilds_id
		FROM permissions p
		JOIN hash_permissions hp ON hp.permissions_id = p.permissions_id
		JOIN hash h ON h.hash_id = hp.hash_id
		LEFT JOIN roles_hash rh ON rh.hash_id = h.hash_id
		LEFT JOIN roles r ON rh.roles_id = r.roles_id
		WHERE p.permissions_name = ?
		AND (r.guilds_id = ? OR r.guilds_id IS NULL)
		AND (r.roles_id = ? OR r.roles_id IS NULL)`;
		const result = await readDb(checkPermissions, pex, interaction.guild.id, role.id);

		try {
			// SE IL RANK NON ESISTE
			if (!result) {
				const embedLog = new EmbedBuilder()
					.setDescription(`## ${language_result.permissions.embed_title}\n` + language_result.permissions.hash_not_found
						.replace("{0}", `${pex}`))
					.setFooter({ text: `${language_result.permissions.embed_footer}`, iconURL: `${language_result.permissions.embed_icon_url}` })
					.setThumbnail(variables.getBotFooterIcon())
					.setColor(colors.general.error);
				await interaction.reply({ embeds: [embedLog], flags: 64 });
				return;
			}

			// SE UN RUOLO ESISTE LO RIMUOVE ->
			if (result.roles_id) {
				let deleteSql = `DELETE FROM roles_hash WHERE hash_id = ? AND roles_id = ?`
				await runDb(deleteSql,  result.hash_id, result.roles_id);

				const embedLog = new EmbedBuilder()
					.setDescription(`## ${language_result.permissions.embed_title}\n` + language_result.permissions.remove_hash
						.replace("{0}", `${pex}`)
						.replace("{1}", `${role}`))
					.setFooter({ text: `${language_result.permissions.embed_footer}`, iconURL: `${language_result.permissions.embed_icon_url}` })
					.setThumbnail(variables.getBotFooterIcon())
					.setColor(colors.general.error);
				await interaction.reply({ embeds: [embedLog], flags: 64 });
			} else { // SE UN RUOLO NON ESISTE LO AGGIUNGE ->
				//checkRolesRelation(role.id, interaction.guild.id);
				let insertSql = `INSERT INTO roles_hash(roles_id, hash_id) VALUES(?, ?)`;
				await runDb(insertSql, role.id, result.hash_id);
				// let customEmoji = await getEmojifromUrl(interaction.client, "pexadd");
				const embedLog = new EmbedBuilder()
					.setDescription(`## ${language_result.permissions.embed_title}\n` + language_result.permissions.added_hash
						.replace("{0}", `${pex}`)
						.replace("{1}", `${role}`))
					.setFooter({ text: `${language_result.permissions.embed_footer}`, iconURL: `${language_result.permissions.embed_icon_url}` })
					.setThumbnail(variables.getBotFooterIcon())
					.setColor(colors.general.success);
				await interaction.reply({ embeds: [embedLog], flags: 64 });
			}
		}
		catch (error) {
			errorSendControls(error, interaction.client, interaction.guild, "\\ranks-system\\permissions.js");
		}
	},
};