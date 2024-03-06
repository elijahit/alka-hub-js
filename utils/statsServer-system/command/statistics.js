const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('statistics')
		.setDescription('Use this command to setup your statistics category'),
	async execute(interaction) {
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "statsServer", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT statsServerSystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					const customEmoji = await getEmojifromUrl(interaction.client, "stats");
					if (checkFeaturesisEnabled?.statsServerSystem_enabled) {
						// CREO LA CATEGORIA DA IMPOSTARE COME STATS CATEGORY
						const category = await interaction.guild.channels.create({
							type: ChannelType.GuildCategory,
							permissionOverwrites: [
								{
									id: interaction.guild.roles.everyone,
									allow: [PermissionsBitField.Flags.ViewChannel],
									deny: [PermissionsBitField.Flags.Connect],
									type: 0,
								}
							],
							name: "💻 ALKA STATS",
						});
						await category.setPosition(0); // Imposto la posizione del canale in cima.
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.statisticsCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.statisticsCommand.description_embed)
							.setFooter({ text: `${language_result.statisticsCommand.embed_footer}`, iconURL: `${language_result.statisticsCommand.embed_icon_url}` })
							.setColor(0x32a852);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						await runDb('INSERT INTO stats_system_category (guildId, categoryId) VALUES (?, ?)', interaction.guild.id, category.id);
					} else {
						await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\statsServer-system\\statistics.js");
			}
		});
	},
};