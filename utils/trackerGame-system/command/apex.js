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
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/trackerGame-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);

		try {
			await interaction.deferReply();
			let resultApi = await checkApi("iiiTzEazY", "PC");
			if (typeof resultApi == 'object') {
				let customEmoji = await getEmojifromUrl(interaction.client, "apexlegends");

				// API CHECK
				let currentState = resultApi.data.realtime.currentState == "online" ? "🟢" : "🔴";
				
				// CHECK WIN / KILL / DAMAGE
				let globalKill = 0;
				let globalDamage = 0;
				let globalWin = 0;
				for await (const [_, result] of Object.entries(resultApi.data.total)) {
					if(result.name.includes("kills") || result.name.includes("Kills")) {
						globalKill += result.value;
					}
					if(result.name.includes("Damage") || result.name.includes("damage")) {
						globalDamage += result.value;
					}
					if(result.name.includes("Wins") || result.name.includes("wins")) {
						globalWin += result.value;
					}
				}
				// ------------------- //
				
				// CHECK BEST LEGENDS
				let legendsKill = new Map();
				for await (const [key, result] of Object.entries(resultApi.data.legends.all)) {
					if(result.data) {
						await result.data.forEach(value => {
							if(value.name.includes("Kills")) {
								legendsKill.set(key, kill+value.value);
							}
						})
					}
				}
				console.log(legendsKill)
			

				let fields = [
					{name: language_result.apexTracker.username, value: `${resultApi.data.global.tag}${resultApi.data.global.name} ${currentState}`, inline: true},
					{name: language_result.apexTracker.uid, value: `${resultApi.data.global.uid}`, inline: true},
					{name: language_result.apexTracker.level, value: `${resultApi.data.global.level} (${resultApi.data.global.toNextLevelPercent}%)`, inline: true},
					{name: " ", value: " "},
					{name: language_result.apexTracker.scoreBoard, value: `${globalKill} / ${globalWin} / ${globalDamage}`, inline: true}
				];
				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.apexTracker.embed_title}`, iconURL: customEmoji })
					.addFields(fields)
					.setFooter({ text: `${language_result.apexTracker.embed_footer}`, iconURL: `${language_result.apexTracker.embed_icon_url}` })
					.setThumbnail(resultApi.data.global.avatar)
					.setColor(0x318f22);
				interaction.editReply({ embeds: [embedLog] });
			}
		}
		catch (error) {
			errorSendControls(error, interaction.client, interaction.guild, "\\trackerGame-system\\apex.js");
		}
	},
};