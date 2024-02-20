const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const database = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, checkHavePermissions } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('permissionlist')
		.setDescription('Use the following command to set or remove role-based access levels!')
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('The role for which you want to set permission')
				.setRequired(true)
		),
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
		let checkSqlRole = `SELECT * FROM rank_system_permissions WHERE guildId = ? AND roleId = ? AND hashRank = ?`;
		let checkSqlHash = `SELECT hashName FROM rank_system_hash`;

		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await checkHavePermissions(interaction.member, "permissionlist", result => {
			if(result) {

			}
			else {
				// NON HAI IL PERMESSO
			}
		});
	},
};