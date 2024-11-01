const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, returnPermission, noInitGuilds, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

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
	async execute(interaction) {
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
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "logschannel", async result => {
			try {
				if (result) {
					if (await checkFeaturesIsEnabled(interaction.guild, 1)) {
						const checkQuery = `SELECT * FROM logs_system WHERE guilds_id = ?`
						const checkFeature = await readDb(checkQuery, interaction.guild.id);
						const embedLog = new EmbedBuilder();
						//CONTROLLO SE LA ROW E' GIA' PRESENTE NEL DB
						if (checkFeature) {
							checkChannelSql = await readDb(`SELECT * FROM logs_system WHERE guilds_id = ?`, interaction.guild.id);
							if (checkChannelSql[choices]) {
								customEmoji = emoji.general.falseMaker;
								runDb(`UPDATE logs_system SET ${choices} = ? WHERE guilds_id = ?`, null, interaction.guild.id);
								embedLog.setDescription(language_result.commandLogsChannel.description_embed_removed.replace("{0}", choices.split("_")[0]))
									.setColor(colors.general.error);
							} else {
								customEmoji = emoji.general.trueMaker
								runDb(`UPDATE logs_system SET ${choices} = ? WHERE guilds_id = ?`, channel, interaction.guild.id);
								embedLog
									.setDescription(language_result.commandLogsChannel.description_embed.replace("{0}", choices.split("_")[0]))
									.setColor(colors.general.success);
							}

						} else {
							customEmoji = emoji.general.trueMaker
							runDb(`INSERT INTO logs_system (guilds_id, ${choices}) VALUES(?, ?)`, interaction.guild.id, channel);
							embedLog
								.setDescription(language_result.commandLogsChannel.description_embed.replace("{0}", choices.split("_")[0]))
								.setColor(colors.general.success);
						}
						embedLog
							.setAuthor({ name: `${language_result.commandLogsChannel.embed_title}`, iconURL: customEmoji })
							.setFooter({ text: `${language_result.commandLogsChannel.embed_footer}`, iconURL: `${language_result.commandLogsChannel.embed_icon_url}` });
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
				errorSendControls(error, interaction.client, interaction.guild, "\\logs-system\\logschannel.js");
			}
		});
	},
};