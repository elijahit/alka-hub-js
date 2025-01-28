const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbWith3Params, readDbAllWithValue, runDb, readDb, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const { youtubeListener, youtube } = require("../youtubeApi");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('youtubenotify')
		.setDescription('Use this command to insert youtube notifications!')
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('Channel where you want to send notifications')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('id')
				.setDescription('Youtube Channel Id')
				.setRequired(true)
		)
		.addRoleOption(option =>
			option
				.setName('role-mention')
				.setDescription('Role to be mentioned when the channel for notify')
				.setRequired(false)
		),
	async execute(interaction) {
		let channel, idChannel, role;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'channel') channel = value.channel;
			if (value.name == 'id') idChannel = value.value;
			if (value.name == 'role-mention') role = value.role;
		});
		const checkFeaturesisEnabled = await readDb(`SELECT youtubeNotifySystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/youtube-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		if (!checkFeaturesisEnabled?.youtubeNotifySystem_enabled) {
			await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
      return;
    }
		await returnPermission(interaction, "youtubeNotify", async result => {
			try {
				const check = await readDbWith3Params("SELECT * FROM youtube_notify_system WHERE guildId = ? AND channelId = ? AND youtuberId = ?", interaction.guild.id, channel.id, idChannel);
				const checkUser = await youtube.channels.list({
					part: "snippet",
					id: idChannel,
					maxResults: 1
				});
				let customEmoji = await getEmojifromUrl(interaction.client, "youtube");
				if (checkUser.data.pageInfo.totalResults == 1) {
					if (!check) {
						// SE NON ESISTE
						const checkListner = await readDbAllWith1Params("SELECT * FROM youtube_channels_system WHERE channelId = ?", checkUser.data.items[0].id);
						if(checkListner.length < 1) {
							await runDb("INSERT INTO youtube_channels_system (channelId) VALUES (?)", checkUser.data.items[0].id);
							await youtubeListener(checkUser.data.items[0].id);
						}
						if (role?.id) {
							await runDb("INSERT INTO youtube_notify_system (guildId, channelId, youtuberName, roleMention, youtuberId) VALUES (?, ?, ?, ?, ?)", interaction.guild.id, channel.id, checkUser.data.items[0].snippet.title, role.id, checkUser.data.items[0].id);
						} else {
							await runDb("INSERT INTO youtube_notify_system (guildId, channelId, youtuberName, youtuberId) VALUES (?, ?, ?, ?)", interaction.guild.id, channel.id, checkUser.data.items[0].snippet.title, checkUser.data.items[0].id);
						}
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.twitchAddSuccess.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.twitchAddSuccess.description.replace("{0}", `[${checkUser.data.items[0].snippet.title}](https://www.youtube.com/channel/${idChannel})`).replace("{1}", `${channel}`))
							.setFooter({ text: `${language_result.twitchAddSuccess.embed_footer}`, iconURL: `${language_result.twitchAddSuccess.embed_icon_url}` })
							.setThumbnail(`${checkUser.data.items[0].snippet.thumbnails.default.url}`)
							.setColor(0x7d1a13);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					} else {
						//SE ESISTE
						await runDb("DELETE FROM youtube_notify_system WHERE guildId = ? AND channelId = ? AND youtuberName = ?", interaction.guild.id, channel.id, checkUser.data.items[0].snippet.title);
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.twitchRemove.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.twitchRemove.description.replace("{0}", `[${checkUser.data.items[0].snippet.title}](https://www.youtube.com/channel/${idChannel})`).replace("{1}", `${channel}`))
							.setFooter({ text: `${language_result.twitchRemove.embed_footer}`, iconURL: `${language_result.twitchRemove.embed_icon_url}` })
							.setThumbnail(`${checkUser.data.items[0].snippet.thumbnails.default.url}`)
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
				errorSendControls(error, interaction.client, interaction.guild, "\\youtube-system\\youtubenotify.js");
			}
		})
	},
};