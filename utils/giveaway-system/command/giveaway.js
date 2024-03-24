const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const { endDateCheck } = require('../giveawayTiming');


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
		)
		.addNumberOption(value =>
			value
				.setName('winners')
				.setDescription('The maximum number of winners')
				.setRequired(true)
				.setMinValue(1)
		),
	async execute(interaction) {
		const prizes = interaction.options.data[0].value; //string
		const endDate = interaction.options.data[1].value; //string
		const slots = interaction.options.data[2].value; //number
		const winners = interaction.options.data[3].value; //number

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
						// CONTROLLO LA DATA
						if(await endDateCheck(endDate)) {
							//LA DATA E' VALIDA
							
							// CREO IL BOTTONE PER L'INTERAZIONE
							let button = new ButtonBuilder({
								custom_id: "giveawaybutton",
								label: language_result.giveawayStart.button,
								style: ButtonStyle.Primary,
								type: ComponentType.Button
							});
							let buttonRow = new ActionRowBuilder().addComponents(button);

							// RISPONDO ALL'INTERAZIONE
							const embedInteraction = new EmbedBuilder()
								.setAuthor({ name: `${language_result.giveawayStart.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.giveawayStart.interactionResponse)
								.setFooter({ text: `${language_result.giveawayStart.embed_footer}`, iconURL: `${language_result.giveawayStart.embed_icon_url}` })
								.setColor(0xa22297);
							await interaction.reply({ embeds: [embedInteraction], ephemeral: true });

							// INVIO IL MESSAGGIO AL CANALE
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.giveawayStart.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.giveawayStart.description_embed
									.replace("{0}", prizes)
									.replace("{1}", endDate)
									.replace("{2}", slots > 0 ? `${slots}` : language_result.giveawayStart.slotsInfinity)
									.replace("{3}", `${winners}`))
								.setFooter({ text: `${language_result.giveawayStart.embed_footer}`, iconURL: `${language_result.giveawayStart.embed_icon_url}` })
								.setColor(0xa83297);
							let message = await interaction.channel.send({ embeds: [embedLog], components: [buttonRow] });
							
							await runDb("INSERT INTO giveaway_system_container (guildId, channelId, messageId, prizes, slots, endDate, winners) VALUES (?, ?, ?, ?, ?, ?, ?)", interaction.guild.id, interaction.channel.id, message.id, prizes, slots, endDate, winners);
						} else {
							//IL FORMATO NON E' VALIDO DI DATA
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.invalidDate.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.invalidDate.description_embed)
								.setFooter({ text: `${language_result.invalidDate.embed_footer}`, iconURL: `${language_result.invalidDate.embed_icon_url}` })
								.setColor(0x7a090c);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
						}
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\giveaway-system\\giveaway.js");
			}
		});
	},
};