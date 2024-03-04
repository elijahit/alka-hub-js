const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionroleremove')
		.setDescription('Use this command to remove your reaction roles')
		.addStringOption(message => 
			message
				.setName('message')
				.setDescription('The message ID to which you want to remove the reaction role')
				.setRequired(true)
		)
		.addStringOption(emoji => 
			emoji
				.setName('emoji')
				.setDescription('The emoji to which the user must react for the reaction role')
				.setRequired(true)
		),
	async execute(interaction) {
		const message = interaction.options.data[0].value;
		const emoji = interaction.options.data[1].value;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/reactionRole-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "reactionrole", async result => {
			try {
				if (result) {
					const checkFeaturesisEnabled = await readDb(`SELECT reactionRoleSystem_enabled from guilds_config WHERE guildId = ?`, interaction.guild.id);
					
					const customEmoji = await getEmojifromUrl(interaction.client, "reactionrole");
					if (checkFeaturesisEnabled?.reactionRoleSystem_enabled) {
						// CONTROLLO SE IL RUOLO SI TROVA SOTTO AL RUOLO DA IMPOSTARE
						if(interaction.guild.roles.botRoleFor(interaction.client.user).rawPosition < role.rawPosition) {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.removeCommand.description_embed_missingpermissions.replace("{0}", `${interaction.guild.roles.botRoleFor(interaction.client.user)}`))
								.setFooter({ text: `${language_result.removeCommand.embed_footer}`, iconURL: `${language_result.removeCommand.embed_icon_url}` })
								.setColor(0x7a090c);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
							return;
						}
						// CONTROLLO SE IL MESSAGGIO SI TROVA NELLO STESSO CANALE DI DOVE VIENE FATTA L'INTERAZIONE
						let messageResolve;
						try {
							messageResolve = await interaction.channel.messages.fetch(message)
						}
						catch {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.removeCommand.description_embed_channelnotfound)
								.setFooter({ text: `${language_result.removeCommand.embed_footer}`, iconURL: `${language_result.removeCommand.embed_icon_url}` })
								.setColor(0x7a090c);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
							return;
						}

						const checkReactionAlreadySet = await readDbWith3Params(`SELECT * from reactionrole_system_reactions WHERE guildId = ? AND messageId = ? AND emoji = ?`, interaction.guild.id, message, emoji);

						if (!checkReactionAlreadySet) {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.removeCommand.description_embed_notset)
								.setFooter({ text: `${language_result.removeCommand.embed_footer}`, iconURL: `${language_result.removeCommand.embed_icon_url}` })
								.setColor(0x7a090c);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
							return;
						}
						// RIMUOVO LA REACTION ALTRIMENTI ANNULLO TUTTO
						try {
							let emojiResult = emoji;

							if(emoji.length > 2) {
								let emojiParsing = emoji.split(":")[2];
								emojiResult = emojiParsing.slice(0, emojiParsing.length-1);
							}

							const emojiResolve = await messageResolve.reactions.resolve(emojiResult);
							await emojiResolve.remove();

						}
						catch {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.removeCommand.description_embed_emojinotfound)
								.setFooter({ text: `${language_result.removeCommand.embed_footer}`, iconURL: `${language_result.removeCommand.embed_icon_url}` })
								.setColor(0x7a090c);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
							return;
						}

						await runDb('DELETE FROM reactionrole_system_reactions WHERE guildId = ? AND channelId = ? AND messageId = ? AND emoji = ?', interaction.guild.id, interaction.channel.id, message, emoji);

						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.removeCommand.description_embed.replace("{0}", role))
							.setFooter({ text: `${language_result.removeCommand.embed_footer}`, iconURL: `${language_result.removeCommand.embed_icon_url}` })
							.setColor(0xfcba03);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					} else {
						await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\reactionRole-system\\reactionroleremove.js");
			}
		});
	},
};