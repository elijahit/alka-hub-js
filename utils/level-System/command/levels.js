const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

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
					const checkFeaturesisEnabled = await readDb(`SELECT levelsSystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					const checkLevelsIsPresent = await readDbAllWith1Params(`SELECT * from levels_server_system WHERE guild_id = ?`, interaction.guild.id);

					const customEmoji = await getEmojifromUrl(interaction.client, "levels");
					if (checkFeaturesisEnabled?.levelsSystem_enabled) {
						if (checkLevelsIsPresent?.length > 0) {
							await runDb('DELETE FROM levels_server_system WHERE guild_id = ?', interaction.guild.id);

							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.levelsCommand.description_embed_delete.replace("{0}", await interaction.guild.channels.fetch(channel.value)))
								.setFooter({ text: `${language_result.levelsCommand.embed_footer}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
								.setColor(0x7a090c);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
							return;
						}
						await runDb('INSERT INTO levels_server_system (guild_id, channel_id) VALUES (?, ?)', interaction.guild.id, channel.id);

						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.levelsCommand.description_embed.replace("{0}", role))
							.setFooter({ text: `${language_result.levelsCommand.embed_footer}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
							.setColor(0x03fc28);
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