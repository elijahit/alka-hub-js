const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds } = require('../../../bin/HandlingFunctions');

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
		),
	async execute(interaction) {
		let choices, nameChoices;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'languages') {
				choices = value.value;
				nameChoices = value.name;
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
					if (nameChoices == "languages") {
						//CONTROLLO SE IL SERVER E' GIA' INIZIALIZZATO
						const checkInitSql = `SELECT * FROM guilds_config WHERE guildId = ?`
						const checkInit = await readDb(checkInitSql, interaction.guild.id);
						if (!checkInit) {
							runInitSql = `INSERT INTO guilds_config (guildId, languages) VALUES (?, ?) `
							await runDb(runInitSql, interaction.guild.id, choices);
							let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
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
				}
				else {
					let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.noPermission.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.noPermission.description_embed)
						.setFooter({ text: `${language_result.noPermission.embed_footer}`, iconURL: `${language_result.noPermission.embed_icon_url}` })
						.setColor(0x4287f5);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\general\\init.js");
			}
		});
	},
};