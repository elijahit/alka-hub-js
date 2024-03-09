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
		.setDescription('Displays the information of an Apex Legends user')
		.addStringOption(value =>
			value
				.setName('username')
				.setDescription("Username of the user to be searched")
				.setRequired(true)
		)
		.addStringOption(value =>
			value
				.setName('platform')
				.setDescription("Username of the user to be searched")
				.addChoices({
					name: "PC",
					value: "PC"
				})
				.addChoices({
					name: "Playstation",
					value: "PS4"
				})
				.addChoices({
					name: "Xbox",
					value: "X1"
				})
				.setRequired(true)
		),
	async execute(interaction) {
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/trackerGame-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		const username = interaction.options.data[0].value;
		const platform = interaction.options.data[1].value;

		let customEmoji = await getEmojifromUrl(interaction.client, "apexlegends");
		try {
			await interaction.deferReply();
			let resultApi = await checkApi(username, platform);
			if (typeof resultApi == 'object') {

				// API CHECK
				let currentState = resultApi.data.realtime.isOnline == 1 ? "🟢" : "🔴";

				// CHECK WIN / KILL / DAMAGE
				let globalKill = 0;
				let globalDamage = 0;
				let globalWin = 0;
				for await (const [_, result] of Object.entries(resultApi.data.total)) {
					if (result.name.includes("kills") || result.name.includes("Kills")) {
						globalKill += result.value;
					}
					if (result.name.includes("Damage") || result.name.includes("damage")) {
						globalDamage += result.value;
					}
					if (result.name.includes("Wins") || result.name.includes("wins")) {
						globalWin += result.value;
					}
				}
				// ------------------- //

				// CHECK BEST LEGENDS
				let legendsKill = new Map();
				let legendsDamage = new Map();
				let legendsWins = new Map();
				for await (const [key, result] of Object.entries(resultApi.data.legends.all)) {
					if (result.data) {
						await result.data.forEach(value => {
							if (value.name.includes("Kills") || value.name.includes("kills")) {
								let kill = legendsKill.get(key);
								kill ? legendsKill.set(key, kill + value.value) : legendsKill.set(key, value.value)
							}
							if (value.name.includes("damage") || value.name.includes("Damage")) {
								let kill = legendsDamage.get(key);
								kill ? legendsDamage.set(key, kill + value.value) : legendsDamage.set(key, value.value)
							}
							if (value.name.includes("wins") || value.name.includes("Wins")) {
								let kill = legendsWins.get(key);
								kill ? legendsWins.set(key, kill + value.value) : legendsWins.set(key, value.value)
							}
						})
					}
				}
				// CHECK MAX RESULT
				let bestKills = [...legendsKill.entries()].reduce((a, e) => e[1] > a[1] ? e : a);
				let bestDamage = [...legendsDamage.entries()].reduce((a, e) => e[1] > a[1] ? e : a);
				let bestWins = [...legendsWins.entries()].reduce((a, e) => e[1] > a[1] ? e : a);

				let fields = [
					{ name: language_result.apexTracker.username, value: `${resultApi.data.global.tag}${resultApi.data.global.name} ${currentState}`, inline: true },
					{ name: language_result.apexTracker.uid, value: `${resultApi.data.global.uid}`, inline: true },
					{ name: language_result.apexTracker.level, value: `${resultApi.data.global.level} (${resultApi.data.global.toNextLevelPercent}%)`, inline: true },
					{ name: " ", value: " " },
					{ name: language_result.apexTracker.scoreBoard, value: `${globalKill} / ${globalWin} / ${globalDamage}`, inline: true },
					{ name: language_result.apexTracker.bestLegends, value: `**${bestWins[0]}**: ${bestWins[1]} ${language_result.apexTracker.win}\n**${bestKills[0]}**: ${bestKills[1]} ${language_result.apexTracker.kill}\n**${bestDamage[0]}**: ${bestDamage[1]} ${language_result.apexTracker.damage}` },
					{ name: language_result.apexTracker.rank, value: `${resultApi.data.global.rank.rankName} (${resultApi.data.global.rank.rankScore})` }
				];
				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.apexTracker.embed_title}`, iconURL: customEmoji })
					.addFields(fields)
					.setFooter({ text: `${language_result.apexTracker.embed_footer}`, iconURL: `${language_result.apexTracker.embed_icon_url}` })
					.setThumbnail(resultApi.data.global.avatar)
					.setColor(0xfcba03);
				await interaction.editReply({ embeds: [embedLog] });
			}
		}
		catch (error) {
			if(error == "AxiosError: Request failed with status code 404") {
				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.apexTracker.embed_title}`, iconURL: customEmoji })
					.setDescription(language_result.apexTracker.noResult)
					.setFooter({ text: `${language_result.apexTracker.embed_footer}`, iconURL: `${language_result.apexTracker.embed_icon_url}` })
					.setColor(0x9e1114);
				await interaction.editReply({ embeds: [embedLog] });
				return;
			}
			errorSendControls(error, interaction.client, interaction.guild, "\\trackerGame-system\\apex.js");
		}
	},
};