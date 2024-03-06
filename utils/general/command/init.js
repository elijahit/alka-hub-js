const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');

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
				.setDescription('Starting from a UTC time, use +num or -num to set your local time.')
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
					const checkInitSql = `SELECT * FROM guilds_config WHERE guildId = ?`
					const checkInit = await readDb(checkInitSql, interaction.guild.id);
					if (!checkInit && (timeChoices.includes("+") || timeChoices.includes("-"))) {
						runInitSql = `INSERT INTO guilds_config (guildId, languages, timeZone) VALUES (?, ?, ?)`
						await runDb(runInitSql, interaction.guild.id, choices, timeChoices);
						let customEmoji = await getEmojifromUrl(interaction.client, "pexadd");
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.initCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.initCommand.description_embed)
							.setFooter({ text: `${language_result.initCommand.embed_footer}`, iconURL: `${language_result.initCommand.embed_icon_url}` })
							.setColor(0x4287f5);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					} else {
						let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.initCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.initCommand.description_already_embed)
							.setFooter({ text: `${language_result.initCommand.embed_footer}`, iconURL: `${language_result.initCommand.embed_icon_url}` })
							.setColor(0x4287f5);
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