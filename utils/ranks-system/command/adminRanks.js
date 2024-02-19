const { SlashCommandBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const database = require('../../../bin/database');

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
		let checkSql = `SELECT * FROM rank_system_role WHERE guildId = ? AND roleId = ? AND hashRank = ?`;
		
		// AGGIUNGO O CANCELLO IL VALORE NEL DB
		database.db.get(checkSql, [interaction.guild.id, role.id, pex], async (_, result) => {
			if(result) {
				let deleteSql = `DELETE FROM rank_system_role WHERE guildId = ? AND roleId = ? AND hashRank = ?`
				database.addValueDatabase(deleteSql, interaction.guild.id, role.id, pex);
			} else {
				let insertSql = `INSERT INTO rank_system_role(guildId, roleId, hashRank) VALUES(?, ?, ?)`
				database.addValueDatabase(insertSql, interaction.guild.id, role.id, pex);
			}
		})
		await interaction.reply(language_result.adminRanks.test);
	},
};