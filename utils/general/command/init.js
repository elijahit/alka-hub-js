const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { read, readFileSync } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const emoji = require("../../../bin/data/emoji");
const colors = require("../../../bin/data/colors");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init')
		.setDescription('Use this command to initialize the bot on your server')
		.addStringOption(option =>
			option
				.addChoices({
					name: "English",
					value: "EN",
				})
				.addChoices({
					name: "Italiano",
					value: "IT",
				})
				.setName('languages')
				.setDescription('Please specify the language you wish to use')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("timezone")
				.setDescription('Enter the timezone of your country example: "GB" or "IT')
				.setRequired(true)
		),
	async execute(interaction) {
		let choices, nameChoices, timeChoices;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'languages') {
				choices = value.value;
				nameChoices = value.name;
			}
			if (value.name == 'timezone') {
				timeChoices = value.value;
			}
		});

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/general/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "init", async result => {
			try {
				if (result) {
					//CONTROLLO SE IL SERVER E' GIA' INIZIALIZZATO
					const checkInitSql = `SELECT * FROM guilds WHERE guilds_id = ?`
					const checkInit = await readDb(checkInitSql, interaction.guild.id);
					if (!checkInit) {
						const timeZoneArray = require("../data/timeZone");
						const timeZoneFiltered = timeZoneArray.map(entry => entry.split('|'));
						const resolveData = timeZoneFiltered.filter(value => value[0] == timeChoices || value[1] == timeChoices);

						if(resolveData.length > 0) {
							runInitSql = `INSERT INTO guilds (guilds_id, language, time_zone) VALUES (?, ?, ?)`;

							await runDb(runInitSql, interaction.guild.id, choices, resolveData[0][1]);

							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.initCommand.embed_title}`, iconURL: emoji.general.trueMaker })
								.setDescription(language_result.initCommand.description_embed)
								.setFooter({ text: `${language_result.initCommand.embed_footer}`, iconURL: `${language_result.initCommand.embed_icon_url}` })
								.setColor(colors.general.success);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
						}
						else {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.initCommand.embed_title}`, iconURL: emoji.general.errorMarker })
							.setDescription(language_result.initCommand.error_timezone)
							.setFooter({ text: `${language_result.initCommand.embed_footer}`, iconURL: `${language_result.initCommand.embed_icon_url}` })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						}

					} else {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.initCommand.embed_title}`, iconURL: emoji.general.errorMarker })
							.setDescription(language_result.initCommand.description_already_embed)
							.setFooter({ text: `${language_result.initCommand.embed_footer}`, iconURL: `${language_result.initCommand.embed_icon_url}` })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\general\\init.js");
			}
		});
	},
};