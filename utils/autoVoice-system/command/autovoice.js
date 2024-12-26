// Code: utils/autoVoice-system/command/autovoice.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file autovoice.js
 * @module autovoice
 * @description Questo file contiene il comando per inizializzare il sistema di auto voice
 */

const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const fs = require('fs');
const { readDb, runDb, readDbAllWith2Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autovoice')
		.setDescription(' Use this command to initialize the Auto Voice System'),
	async execute(interaction) {
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = fs.readFileSync(`./languages/autoVoice-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "autovoice", async result => {
			if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 3, true, language_result.noPermission.description_embed_no_features_by_system, 
				language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
				language_result.noPermission.description_embed_no_features)) return;
			try {
				if (result) {
					const filePath = `./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`;
					if (fs.existsSync(filePath)) {
						const fileJson = fs.readFileSync(filePath);
						const fileJsonToObj = JSON.parse(fileJson);
						try {
							const deleteChannel = await interaction.guild.channels.fetch(fileJsonToObj.channel_setup);
							if (deleteChannel) {
								await deleteChannel.delete();
							}
						} catch (error) {
							// Ignora se non trova il canale
						}
						fs.unlinkSync(filePath);
					}
					fs.writeFileSync(filePath, '{\n');
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
							/*.setEmoji(channelVoiceEmoji.id),*/
						);

					const row = new ActionRowBuilder()
						.addComponents(selectSetup);

					const customEmoji = emoji.general.utility
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.selectSetup.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.selectSetup.description_embed)
						.setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
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
						.setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
						.setColor(0x03cffc);

					await interaction.reply({ embeds: [embedLogTwo], ephemeral: true });
					await initChannel.send({ embeds: [embedLog], components: [row] });
					fs.appendFileSync(filePath, `"guild_id": "${interaction.guild.id}",
			"author_id": "${interaction.user.id}",
			"channel_start": "${interaction.channel.id}",
			"channel_setup": "${initChannel.id}" 
			}`, 'utf8');
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