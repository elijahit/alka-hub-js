const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const database = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('permissions')
		.setDescription('Use the following command to set or remove role-based access levels!')
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('The role for which you want to set permission')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('pex')
				.setDescription('Hash of the command to assign permissions to')
				.setRequired(true)
		)
		.setDefaultMemberPermissions(8),
	async execute(interaction) {
		let role, pex;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'role') role = value.role;
			if (value.name == 'pex') pex = value.value;
		});

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/ranks-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLO SE IL VALORE ESISTE
		let checkSql = `SELECT * FROM rank_system_permissions WHERE guildId = ? AND roleId = ? AND hashRank = ?`;
		let checkSqlHash = `SELECT hashName FROM rank_system_hash`;

		// AGGIUNGO O CANCELLO IL VALORE NEL DB
		database.db.get(checkSql, [interaction.guild.id, role.id, pex], async (_, result) => {
			// CONTROLLA SE L'HASH ESISTE
			database.db.all(checkSqlHash, [], async (_, resultCheck) => {
				try {
					let checkPass = false;
					resultCheck.forEach(value => {
						if (value.hashName == pex) {
							checkPass = true;
						}
					})
					if (checkPass == false) {
						let customEmoji = await getEmojifromUrl(interaction.client, "pexerror");
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.permissions.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.permissions.hash_not_found
								.replace("{0}", `${pex}`))
							.setFooter({ text: `${language_result.permissions.embed_footer}`, iconURL: `${language_result.permissions.embed_icon_url}` })
							.setColor(0x22809c);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						return;
					}
					// SE UN RUOLO ESISTE LO RIMUOVE ->
					if (result) {
						let deleteSql = `DELETE FROM rank_system_permissions WHERE guildId = ? AND roleId = ? AND hashRank = ?`
						database.addValueDatabase(deleteSql, interaction.guild.id, role.id, pex);
						let customEmoji = await getEmojifromUrl(interaction.client, "pexremoved");
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.permissions.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.permissions.remove_hash
								.replace("{0}", `${pex}`)
								.replace("{1}", `${role}`))
							.setFooter({ text: `${language_result.permissions.embed_footer}`, iconURL: `${language_result.permissions.embed_icon_url}` })
							.setColor(0x9e2c24);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					} else { // SE UN RUOLO NON ESISTE LO AGGIUNGE ->
						let insertSql = `INSERT INTO rank_system_permissions(guildId, roleId, hashRank) VALUES(?, ?, ?)`
						database.addValueDatabase(insertSql, interaction.guild.id, role.id, pex);
						let customEmoji = await getEmojifromUrl(interaction.client, "pexadd");
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.permissions.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.permissions.added_hash
								.replace("{0}", `${pex}`)
								.replace("{1}", `${role}`))
							.setFooter({ text: `${language_result.permissions.embed_footer}`, iconURL: `${language_result.permissions.embed_icon_url}` })
							.setColor(0x3d9c22);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					}
				}
				catch (error) {
					errorSendControls(error, interaction.client, interaction.guild, "\\ranks-system\\permissions.js");
				}
			})
		})
	},
};