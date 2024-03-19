const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, getVoiceConnection } = require('@discordjs/voice')
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDb, runDb, readDbAllWith1Params, readDbAllWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noEnabledFunc, noHavePermission } = require('../../../bin/HandlingFunctions');
const play = require('play-dl');
const { audiPlayer } = require('./play')


// FUNZIONI

async function controlVote(interaction, voteCount, userCount, customEmoji, language_result) {
	return await returnPermission(interaction, "musicNextSkip", async result => {
		if (result) {
			await runDb("DELETE FROM music_vote_system WHERE guildId = ? AND actions = ?", interaction.guild.id, "NEXT");

			const voiceChannelId = getVoiceConnection(interaction.guild.id).joinConfig.channelId;

			getVoiceConnection(interaction.guild.id).state.subscription.player.stop();

			return true;
		} else {
			if (voteCount >= Math.trunc(userCount / 2)) {
				await runDb("DELETE FROM music_vote_system WHERE guildId = ? AND actions = ?", interaction.guild.id, "NEXT");

				getVoiceConnection(interaction.guild.id).state.subscription.player.stop();
				return true;
			}
		}
	});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next')
		.setDescription('Use this command to next a music on channel'),
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
				let checkDatabaseVote = await readDbAllWith2Params('SELECT * FROM music_vote_system WHERE guildId = ? AND actions = ?', interaction.guild.id, "NEXT");
				let voteCount = checkDatabaseVote.length;

				if (interaction.member.voice.channelId == voiceChannelId) {
					let checkDatabaseUser = await readDbAllWith3Params('SELECT * FROM music_vote_system WHERE guildId = ? AND actions = ? AND userId = ?', interaction.guild.id, "NEXT", interaction.user.id);
					if (checkDatabaseUser.length == 0) {
						await runDb("INSERT INTO music_vote_system (guildId, actions, userId) VALUES (?,?,?)", interaction.guild.id, "NEXT", interaction.user.id);

						if (await controlVote(interaction, voteCount + 1, userCount, customEmoji, language_result)) {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.NextVoteClose.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.NextVoteClose.description)
								.setFooter({ text: `${language_result.NextVoteClose.embed_footer}`, iconURL: `${language_result.NextVoteClose.embed_icon_url}` })
								.setColor(0x78070d);
							await interaction.reply({ embeds: [embedLog] });
						} else {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.NextVoteMessage.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.NextVoteMessage.description.replace("{0}", interaction.client.user).replace("{1}", voteCount + 1).replace("{2}", Math.trunc(userCount / 2)))
								.setFooter({ text: `${language_result.NextVoteMessage.embed_footer}`, iconURL: `${language_result.NextVoteMessage.embed_icon_url}` })
								.setColor(0xebae34);
							await interaction.reply({ embeds: [embedLog] });
						}
					} else {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.alreadyVoteNext.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.alreadyVoteNext.description)
							.setFooter({ text: `${language_result.alreadyVoteNext.embed_footer}`, iconURL: `${language_result.alreadyVoteNext.embed_icon_url}` })
							.setColor(0x78070d);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					}
				} else {
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.noConnectNextVote.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.noConnectNextVote.description)
						.setFooter({ text: `${language_result.noConnectNextVote.embed_footer}`, iconURL: `${language_result.noConnectNextVote.embed_icon_url}` })
						.setColor(0x78070d);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}

			} else {
				const embedLog = new EmbedBuilder()
					.setAuthor({ name: `${language_result.noBotConnectNextVote.embed_title}`, iconURL: customEmoji })
					.setDescription(language_result.noBotConnectNextVote.description)
					.setFooter({ text: `${language_result.noBotConnectNextVote.embed_footer}`, iconURL: `${language_result.noBotConnectNextVote.embed_icon_url}` })
					.setColor(0x78070d);
				await interaction.reply({ embeds: [embedLog], ephemeral: true });
			}

		}
		catch (error) {
			errorSendControls(error, interaction.client, interaction.guild, "\\music-system\\stop.js");
		}
	},
};