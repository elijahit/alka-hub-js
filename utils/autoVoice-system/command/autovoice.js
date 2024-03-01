const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autovoice')
		.setDescription(' Use this command to initialize the Auto Voice System'),
	async execute(interaction) {

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/autoVoice-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "autovoice", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT autoVoiceSystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

					if (checkFeaturesisEnabled?.autoVoiceSystem_enabled) {
						const checkSql = await readDbAllWith2Params(`SELECT * from autovoice_system_creator WHERE authorId = ? AND guildId = ?`, interaction.user.id, interaction.guild.id);
						if(checkSql) {
							await runDb(`DELETE from autovoice_system_creator WHERE authorId = ? AND guildId = ?`, interaction.user.id, interaction.guild.id);
						}
						const channelTextEmoji = await getEmoji(interaction.client, "channeltext");
						const channelVoiceEmoji = await getEmoji(interaction.client, "channelvoice");
						const selectSetup = new StringSelectMenuBuilder()
							.setCustomId('autoVoiceSelectMenu')
							.setPlaceholder(language_result.selectSetup.placeholder)
							.addOptions(
								// new StringSelectMenuOptionBuilder() //DA PROGRAMMARE
								// 	.setLabel(language_result.selectSetup.label_interaction)
								// 	.setValue("interactionVoice")
								// 	.setEmoji(channelTextEmoji.id),
								new StringSelectMenuOptionBuilder()
									.setLabel(language_result.selectSetup.label_automatic)
									.setValue("automaticVoice")
									.setEmoji(channelVoiceEmoji.id),
							);

						const row = new ActionRowBuilder()
							.addComponents(selectSetup);

						const customEmoji = await getEmojifromUrl(interaction.client, "utilitysettings")
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.selectSetup.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.selectSetup.description_embed)
							.setFooter({ text: `${language_result.selectSetup.embed_footer}`, iconURL: `${language_result.selectSetup.embed_icon_url}` })
							.setColor(0x9ba832);

						// CREO IL CANALE TEMPORANEO DI SETUP
						const initChannel = await interaction.guild.channels.create({
							name: 'setup-autovoice',
							type: ChannelType.GuildText,
							permissionOverwrites: [
								{
									id: interaction.user.id,
									allow: [PermissionFlagsBits.ViewChannel],
								},
								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionFlagsBits.ViewChannel],
								}
							],
						})

						const embedLogTwo = new EmbedBuilder()
							.setAuthor({ name: `${language_result.selectSetup.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.selectSetup.description_embed_two.replace("{0}", initChannel))
							.setFooter({ text: `${language_result.selectSetup.embed_footer}`, iconURL: `${language_result.selectSetup.embed_icon_url}` })
							.setColor(0x03cffc);

						await interaction.reply({ embeds: [embedLogTwo], ephemeral: true });
						await initChannel.send({ embeds: [embedLog], components: [row] });
						await runDb(`INSERT INTO autovoice_system_creator (guildId, authorId, initChannel) VALUES (?, ?, ?)`, interaction.guild.id, interaction.user.id, interaction.channel.id);


					} else {
						await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\autoVoice-system\\autovoice.js");
			}
		});
	},
};