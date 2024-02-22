const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logschannel')
		.setDescription('Use this command to set up the Logs System channels')
		.addStringOption(option =>
			option
				.addChoices({
					name: "Emoji State",
					value: "emojiState_channel",
				})
				.addChoices({
					name: "Ban State",
					value: "guildBanState_channel",
				})
				.addChoices({
					name: "Voice State",
					value: "voiceStateJoin_channel",
				})
				.addChoices({
					name: "Member State",
					value: "guildMemberState_channel",
				})
				.addChoices({
					name: "Guild State",
					value: "guildState_channel",
				})
				.addChoices({
					name: "Invite State",
					value: "inviteState_channel",
				})
				.addChoices({
					name: "Message State",
					value: "messageState_channel",
				})
				.addChoices({
					name: "Channel State",
					value: "channelState_channel",
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
		let choices, channel;
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
					const checkQuery = `SELECT ${choices} FROM log_system_config WHERE guildId = ?`
					const checkFeature = await readDb(checkQuery, interaction.guild.id);

					//CONTROLLO SE LA ROW E' GIA' PRESENTE NEL DB
					if (checkFeature) {
						runDb(`UPDATE log_system_config SET ${choices} = ? WHERE guildId = ?`, channel, interaction.guild.id);

					} else {
						runDb(`INSERT INTO log_system_config (guildId, ${choices}) VALUES(?, ?)`, interaction.guild.id, channel);
					}
					let customEmoji = await getEmojifromUrl(interaction.client, "pexadd");
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.commandLogsChannel.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.commandLogsChannel.description_embed.replace("{0}", choices.split("_")[0]))
						.setFooter({ text: `${language_result.commandLogsChannel.embed_footer}`, iconURL: `${language_result.commandLogsChannel.embed_icon_url}` })
						.setColor(0x119c05);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}
				else {
					let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.noPermission.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.noPermission.description_embed)
						.setFooter({ text: `${language_result.noPermission.embed_footer}`, iconURL: `${language_result.noPermission.embed_icon_url}` })
						.setColor(0x4287f5);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\logs-system\\logschannel.js");
			}
		});
	},
};