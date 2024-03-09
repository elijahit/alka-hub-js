const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const axios = require('axios').default;

// --- API CONFIG ----
// Token by https://portal.apexlegendsapi.com/
const token = "d3fa0208730271a7c6b5bf71648a37d7";
const baseUrl = `https://api.mozambiquehe.re/bridge?auth=${token}`;

// FUNCTION 

async function checkApi(name, platform) {
	return await axios.get(`${baseUrl}&player=${name}&platform=${platform}`);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('apex')
		.setDescription('CHANGE NEXT'),
	async execute(interaction) {
		// RECUPERO LA LINGUA
		try {
			let resultApi = await checkApi("9_EazY_9", "PC");
			console.log(resultApi)

			if(typeof resultApi == Object) {
				
			}
		}
		catch (error) {
			errorSendControls(error, interaction.client, interaction.guild, "\\trackerGame-system\\apex.js");
		}
	},
};