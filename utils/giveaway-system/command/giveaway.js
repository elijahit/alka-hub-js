const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// FUNCTION
async function endDateCheck(endDate) {
	let errorCount = 0;
	// La data contiene errori
	if (endDate.length != 16 ||
		!endDate.includes('/') ||
		!endDate.includes(':')) errorCount++;
	let allDateArray = endDate.split(" ");
	let dateArray = allDateArray[0].split("/"); //[00,00,0000]
	let hourArray = allDateArray[1].split(":"); //[00,00]
	// DA CONTINUARE CONTROLLo
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('Use this command to set your giveaways')
		.addStringOption(value =>
			value
				.setName('prizes')
				.setDescription('The prize you want to give to the winner(s)')
				.setRequired(true)
		)
		.addStringOption(value =>
			value
				.setName('date')
				.setDescription('The giveaway end date and time')
				.setRequired(true),
		)
		.addNumberOption(value =>
			value
				.setName('slots')
				.setDescription('The maximum number of participants')
				.setRequired(true)
		),
	async execute(interaction) {
		const prizes = interaction.options.data[0].value; //string
		const endDate = interaction.options.data[1].value; //string
		const slots = interaction.options.data[2].value; //slots

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/giveaway-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "giveaway", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT giveawaySystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					const customEmoji = await getEmojifromUrl(interaction.client, "reactionrole");
					if (checkFeaturesisEnabled?.giveawaySystem_enabled) {
						await endDateCheck(endDate)

					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\reactionRole-system\\reactionrole.js");
			}
		});
	},
};