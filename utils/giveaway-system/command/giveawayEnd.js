const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const { endGiveaway } = require('../giveawayTiming');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveawayend')
		.setDescription('Use this command to immediately conclude your giveaway')
		.addNumberOption(value =>
			value
				.setName('id')
				.setDescription('The id of giveaway')
				.setRequired(true)
		),
	async execute(interaction) {
		const giveawayId = interaction.options.data[0].value; //number

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/giveaway-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "giveaway", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT giveawaySystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					const customEmoji = await getEmojifromUrl(interaction.client, "giveaway");
					if (checkFeaturesisEnabled?.giveawaySystem_enabled) {
						// CONTROLLO IL DATABASE DEI GIVEAWAY
						let checkGiveaway = await readDbAllWith2Params("SELECT * FROM giveaway_system_container WHERE guildId = ? AND ID = ?", interaction.guild.id, giveawayId);

						if(checkGiveaway.length > 0) {
							//SE IL GIVEAWAY ESISTE
							await endGiveaway(checkGiveaway[0], language_result);
							const embedInteraction = new EmbedBuilder()
								.setAuthor({ name: `${language_result.giveawayEnd.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.giveawayEnd.description_embed
									.replace("{0}", `${checkGiveaway[0].ID}`))
								.setFooter({ text: `${language_result.giveawayEnd.embed_footer}`, iconURL: `${language_result.giveawayEnd.embed_icon_url}` })
								.setColor(0xa22297);
							await interaction.reply({ embeds: [embedInteraction], ephemeral: true });
						} else {
							//SE IL GIVEAWAY NON ESISTE
							const embedInteraction = new EmbedBuilder()
								.setAuthor({ name: `${language_result.giveawayEnd.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.giveawayEnd.noGiveawayExist)
								.setFooter({ text: `${language_result.giveawayEnd.embed_footer}`, iconURL: `${language_result.giveawayEnd.embed_icon_url}` })
								.setColor(0x5c090c);
							await interaction.reply({ embeds: [embedInteraction], ephemeral: true });
						}
					} else {
						await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\giveaway-system\\giveawayEnd.js");
			}
		});
	},
};