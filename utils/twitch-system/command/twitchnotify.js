const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbWith3Params, readDbAllWithValue, runDb, readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const { api } = require("../twitch");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('twitchnotify')
		.setDescription('Use this command to insert live twitch notifications!')
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('Channel where you want to send notifications')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('username')
				.setDescription('Twitch username')
				.setRequired(true)
		)
		.addRoleOption(option =>
			option
				.setName('role-mention')
				.setDescription('Role to be mentioned when the channel is live')
				.setRequired(false)
		),
	async execute(interaction) {
		let channel, username, role;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'channel') channel = value.channel;
			if (value.name == 'username') username = value.value;
			if (value.name == 'role-mention') role = value.role;
		});
		const checkFeaturesisEnabled = await readDb(`SELECT twitchNotifySystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/twitch-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		if (!checkFeaturesisEnabled?.twitchNotifySystem_enabled) {
			await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
      return;
    }
		await returnPermission(interaction, "twitchNotify", async result => {
			try {
				const check = await readDbWith3Params("SELECT * FROM twitch_notify_system WHERE guildId = ? AND channelId = ? AND streamerName = ?", interaction.guild.id, channel.id, username);
				const checkUser = await api.get('users', { search: { login: `${username}` } });
				let customEmoji = await getEmojifromUrl(interaction.client, "twitch");
				if (checkUser.data.length > 0) {
					if (!check) {
						// SE NON ESISTE
						if (role?.id) {
							await runDb("INSERT INTO twitch_notify_system (guildId, channelId, streamerName, roleMention, streamerId) VALUES (?, ?, ?, ?, ?)", interaction.guild.id, channel.id, username, role.id, checkUser.data[0].id);
						} else {
							await runDb("INSERT INTO twitch_notify_system (guildId, channelId, streamerName, streamerId) VALUES (?, ?, ?, ?)", interaction.guild.id, channel.id, username, checkUser.data[0].id);
						}
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.twitchAddSuccess.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.twitchAddSuccess.description.replace("{0}", `[${username}](https://twitch.tv/${username})`).replace("{1}", `${channel}`))
							.setFooter({ text: `${language_result.twitchAddSuccess.embed_footer}`, iconURL: `${language_result.twitchAddSuccess.embed_icon_url}` })
							.setThumbnail(`${checkUser.data[0].profileImageUrl}`)
							.setColor(0x6e0b8c);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					} else {
						//SE ESISTE
						await runDb("DELETE FROM twitch_notify_system WHERE guildId = ? AND channelId = ? AND streamerName = ?", interaction.guild.id, channel.id, username);
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.twitchRemove.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.twitchRemove.description.replace("{0}", `[${username}](https://twitch.tv/${username})`).replace("{1}", `${channel}`))
							.setFooter({ text: `${language_result.twitchRemove.embed_footer}`, iconURL: `${language_result.twitchRemove.embed_icon_url}` })
							.setThumbnail(`${checkUser.data[0].profileImageUrl}`)
							.setColor(0x63041f);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					}
				} else {
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.twitchNotFound.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.twitchNotFound.description)
						.setFooter({ text: `${language_result.twitchNotFound.embed_footer}`, iconURL: `${language_result.twitchNotFound.embed_icon_url}` })
						.setColor(0x63041f);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\twitch-system\\twitchnotify.js");
			}
		})
	},
};