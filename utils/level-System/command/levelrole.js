const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('levelrole')
		.setDescription('Use this command to set your role in the level system.')
		.addRoleOption(role =>
			role
				.setName('role')
				.setDescription('The role to set when reaching a certain level')
				.setRequired(true)
		)
		.addIntegerOption(level =>
			level
				.setName('level')
				.setDescription('The level to reach to have the set role')
				.setRequired(true)
		),
	async execute(interaction) {
		const role = interaction.options.data[0].role;
		const level = interaction.options.data[0].level;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "levels", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT levelsSystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					const checkLevelsIsPresent = await readDbAllWith2Params(`SELECT * from levels_server_roles WHERE guild_id = ? AND role_id = ?`, interaction.guild.id, role.id);

					const customEmoji = await getEmojifromUrl(interaction.client, "levels");
					if (checkFeaturesisEnabled?.levelsSystem_enabled) {
						if (checkLevelsIsPresent?.length > 0) {
							await runDb('DELETE FROM levels_server_roles WHERE guild_id = ? AND role_id = ?', interaction.guild.id, role.id);

							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.levelsCommand.description_embed_delrole.replace("{0}", role))
								.setFooter({ text: `${language_result.levelsCommand.embed_footer}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
								.setColor(0x7a090c);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
							return;
						}
						await runDb('INSERT INTO levels_server_roles (guild_id, role_id, level) VALUES (?, ?, ?)', interaction.guild.id, role.id, level);

						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.levelsCommand.description_embed_addrole.replace("{0}", role).replace("{1}", level))
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