// Code: utils/logs-system/command/logschannel.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file logschannel.js
 * @module logschannel
 * @description Questo file contiene il comando per impostare i canali del sistema di Logs
 */

const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, returnPermission, noInitGuilds, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { findLogsByGuildId, updateLogs, createLogs } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logschannel')
		.setDescription('Use this command to set up the Logs System channels')
		.addStringOption(option =>
			option
				.addChoices({
					name: "Add Member State",
					value: "join_member_channel",
				})
				.addChoices({
					name: "Remove Member State",
					value: "exit_member_channel",
				})
				.addChoices({
					name: "Emoji State",
					value: "emoji_state_channel",
				})
				.addChoices({
					name: "Ban State",
					value: "ban_state_channel",
				})
				.addChoices({
					name: "Voice State",
					value: "voice_state_channel",
				})
				.addChoices({
					name: "Member State",
					value: "member_state_channel",
				})
				.addChoices({
					name: "Guild State",
					value: "guild_state_channel",
				})
				.addChoices({
					name: "Invite State",
					value: "invite_state_channel",
				})
				.addChoices({
					name: "Message State",
					value: "message_state_channel",
				})
				.addChoices({
					name: "Channel State",
					value: "channel_state_channel",
				})
				.setName('state_event')
				.setDescription('Select an event to set the channel for')
				.setRequired(true)
		)
		.addChannelOption(option =>
			option
				.addChannelTypes(ChannelType.GuildText)
				.setName('channel_logs')
				.setDescription('Select the channel to set as the logs channel')
				.setRequired(true)
		),
	async execute(interaction, variables) {
		let choices, channel, customEmoji;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'state_event') {
				choices = value.value;
			}
			if (value.name == "channel_logs") {
				channel = value.value;
			}
		});

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "logschannel", async result => {
			if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 1, true, language_result.noPermission.description_embed_no_features_by_system,
				language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
				language_result.noPermission.description_embed_no_features, variables)) return;
			try {
				if (result) {
					let logsTable = await findLogsByGuildId(interaction.guild.id, variables);
					checkTable = logsTable?.get({ plain: true });
					const embedLog = new EmbedBuilder();
					//CONTROLLO SE LA ROW E' GIA' PRESENTE NEL DB
					if (checkTable) {
						if (checkTable[choices]) {
							customEmoji = emoji.general.falseMaker;
							await updateLogs({ [choices]: null }, { where: { id: checkTable.id } });
							embedLog.setDescription(language_result.commandLogsChannel.description_embed_removed.replace("{0}", choices.split("_")[0]))
								.setColor(colors.general.error);
						} else {
							customEmoji = emoji.general.trueMaker
							await updateLogs({ [choices]: channel }, { where: { id: checkTable.id } });
							embedLog
								.setDescription(language_result.commandLogsChannel.description_embed.replace("{0}", choices.split("_")[0]))
								.setColor(colors.general.success);
						}

					} else {
						customEmoji = emoji.general.trueMaker
						await createLogs(interaction.guild.id, choices, channel);

						embedLog
							.setDescription(language_result.commandLogsChannel.description_embed.replace("{0}", choices.split("_")[0]))
							.setColor(colors.general.success);
					}
					embedLog
						.setAuthor({ name: `${language_result.commandLogsChannel.embed_title}`, iconURL: customEmoji })
						.setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` });
					await interaction.reply({ embeds: [embedLog], ephemeral: true });


				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\logs-system\\logschannel.js", );
			}
		});
	},
};