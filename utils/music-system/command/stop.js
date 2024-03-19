const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, getVoiceConnection } = require('@discordjs/voice')
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDb, runDb, readDbAllWith1Params, readDbAllWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');


// FUNZIONI

async function controlVote(interaction, voteCount, userCount) {
	return await returnPermission(interaction, "musicStopSkip", async result => {
		if (result) {
			await runDb("DELETE FROM music_vote_system WHERE guildId = ? AND actions = ?", interaction.guild.id, "STOP");
			getVoiceConnection(interaction.guild.id).disconnect();
			return true;
		} else {
			if (voteCount >= Math.trunc(userCount / 2)) {
				await runDb("DELETE FROM music_vote_system WHERE guildId = ? AND actions = ?", interaction.guild.id, "STOP");
				getVoiceConnection(interaction.guild.id).disconnect();
				return true;
			}
		}
	});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Use this command to stop a music on channel'),
	async execute(interaction) {
		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/music-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		try {
			let customEmoji = await getEmojifromUrl(interaction.client, "musicBot");
			if (getVoiceConnection(interaction.guild.id) && getVoiceConnection(interaction.guild.id)?._state.status == "ready") {
				let voiceChannelId = getVoiceConnection(interaction.guild.id).joinConfig.channelId;
				let voiceChannel = await interaction.guild.channels.fetch(voiceChannelId);
				let userCount = voiceChannel.members.size - 1;
				let checkDatabaseVote = await readDbAllWith2Params('SELECT * FROM music_vote_system WHERE guildId = ? AND actions = ?', interaction.guild.id, "STOP");
				let voteCount = checkDatabaseVote.length;

				if (interaction.member.voice.channelId == voiceChannelId) {
					let checkDatabaseUser = await readDbAllWith3Params('SELECT * FROM music_vote_system WHERE guildId = ? AND actions = ? AND userId = ?', interaction.guild.id, "STOP", interaction.user.id);
					if (checkDatabaseUser.length == 0) {
						await runDb("INSERT INTO music_vote_system (guildId, actions, userId) VALUES (?,?,?)", interaction.guild.id, "STOP", interaction.user.id);
						//MESSAGGIO DA INSERIRE

						if (await controlVote(interaction, voteCount + 1, userCount)) {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.stopVoteClose.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.stopVoteClose.description.replace("{0}", interaction.client.user))
								.setFooter({ text: `${language_result.stopVoteClose.embed_footer}`, iconURL: `${language_result.stopVoteClose.embed_icon_url}` })
								.setColor(0x78070d);
							await interaction.reply({ embeds: [embedLog] });
						} else {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.stopVoteMessage.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.stopVoteMessage.description.replace("{0}", interaction.client.user).replace("{1}", voteCount + 1).replace("{2}", Math.trunc(userCount / 2)))
								.setFooter({ text: `${language_result.stopVoteMessage.embed_footer}`, iconURL: `${language_result.stopVoteMessage.embed_icon_url}` })
								.setColor(0xebae34);
							await interaction.reply({ embeds: [embedLog] });
						}
					} else {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.alreadyVoteStop.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.alreadyVoteStop.description)
							.setFooter({ text: `${language_result.alreadyVoteStop.embed_footer}`, iconURL: `${language_result.alreadyVoteStop.embed_icon_url}` })
							.setColor(0x78070d);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					}
				} else {
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.noConnectStopVote.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.noConnectStopVote.description)
						.setFooter({ text: `${language_result.noConnectStopVote.embed_footer}`, iconURL: `${language_result.noConnectStopVote.embed_icon_url}` })
						.setColor(0x78070d);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}

			} else {
				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.noBotConnectStopVote.embed_title}`, iconURL: customEmoji })
					.setDescription(language_result.noBotConnectStopVote.description)
					.setFooter({ text: `${language_result.noBotConnectStopVote.embed_footer}`, iconURL: `${language_result.noBotConnectStopVote.embed_icon_url}` })
					.setColor(0x78070d);
				await interaction.reply({ embeds: [embedLog], ephemeral: true });
			}

		}
		catch (error) {
			errorSendControls(error, interaction.client, interaction.guild, "\\music-system\\stop.js");
		}
	},
};