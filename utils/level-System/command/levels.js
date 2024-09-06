const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('levels')
		.setDescription('Use this command to set your levels system.')
		.addChannelOption(channel =>
			channel
				.setName('channel')
				.setDescription('The channel in which level notifications are sent')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true)
		),
	async execute(interaction) {
		const channel = interaction.options.data[0].channel;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "levels", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT is_enabled_levels from guilds WHERE guilds_id = ?`, interaction.guild.id);

					const checkChannelIsPresent = await readDbAllWith1Params(`SELECT * from levels_config WHERE guilds_id = ?`, interaction.guild.id);

					const customEmoji = emoji.levelsSystem.levelsMaker;
					if (checkFeaturesisEnabled?.is_enabled_levels) {
						if (checkChannelIsPresent?.length > 0) {
							await runDb('DELETE FROM levels_config WHERE guilds_id = ?', interaction.guild.id);

							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.levelsCommand.description_embed_delete.replace("{0}", channel))
								.setFooter({ text: `${language_result.levelsCommand.embed_footer}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
								.setColor(colors.general.error);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
							return;
						}
						await runDb('INSERT INTO levels_config (guilds_id, log_channel) VALUES (?, ?)', interaction.guild.id, channel.id);

						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.levelsCommand.description_embed.replace("{0}", channel))
							.setFooter({ text: `${language_result.levelsCommand.embed_footer}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
							.setColor(colors.general.success);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					}
					else {
						await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\levels-system\\levels.js");
			}
		});
	},
};