// Code: utils/reactionRole-system/command/reactionroleremove.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file reactionroleremove.js
 * @module reactionroleremove
 * @description Questo file gestisce il comando per rimuovere i ruoli reazione
 */

const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { errorSendControls, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emojis = require('../../../bin/data/emoji');
const color = require('../../../bin/data/colors');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { removeReactions, findByGuildIdAndMessageIdAndEmojiReactions } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionroleremove')
		.setDescription('Use this command to remove your reaction roles')
		.setDescriptionLocalization("it", "Usa questo comando per rimuovere i tuoi ruoli reazione")
		.addStringOption(message =>
			message
				.setName('message')
				.setDescription('The message ID to which you want to remove the reaction role')
				.setDescriptionLocalization("it", "L'ID del messaggio a cui vuoi rimuovere il ruolo reazione")
				.setRequired(true)
		)
		.addStringOption(emoji =>
			emoji
				.setName('emoji')
				.setDescription('The emoji for remove the reaction role')
				.setDescriptionLocalization("it", "L'emoji per rimuovere il ruolo reazione")
				.setRequired(true)
		),
	async execute(interaction, variables) {
		const message = interaction.options.data[0].value;
		const emoji = interaction.options.data[1].value;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/reactionRole-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "reactionrole", async result => {
			try {
				if (result) {
					if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 5, false, language_result.noPermission.description_embed_no_features_by_system, 
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
						language_result.noPermission.description_embed_no_features, variables)) return;

					// CONTROLLO SE IL RUOLO SI TROVA SOTTO AL RUOLO DA IMPOSTARE
					if (interaction.guild.roles.botRoleFor(interaction.client.user).rawPosition < role.rawPosition) {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
							.setDescription(language_result.removeCommand.description_embed_missingpermissions.replace("{0}", `${interaction.guild.roles.botRoleFor(interaction.client.user)}`))
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(colors.general.error);
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
							.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
							.setDescription(language_result.removeCommand.description_embed_channelnotfound)
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(color.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						return;
					}

					let checkReactionAlreadySet = await findByGuildIdAndMessageIdAndEmojiReactions(interaction.guild.id, message, emoji, variables);
					checkReactionAlreadySet = checkReactionAlreadySet?.get({ plain: true });

					if (!checkReactionAlreadySet) {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
							.setDescription(language_result.removeCommand.description_embed_notset)
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						return;
					}
					// RIMUOVO LA REACTION ALTRIMENTI ANNULLO TUTTO
					try {
						let emojiResult = emoji;

						if (emoji.length > 2) {
							let emojiParsing = emoji.split(":")[2];
							emojiResult = emojiParsing.slice(0, emojiParsing.length - 1);
						}

						const emojiResolve = await messageResolve.reactions.resolve(emojiResult);
						await emojiResolve.remove();

					}
					catch {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
							.setDescription(language_result.removeCommand.description_embed_emojinotfound)
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(color.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						return;
					}

					await removeReactions({guild_id: interaction.guild.id, message_id: message, emoji: emoji}, variables);

					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.removeCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
						.setDescription(language_result.removeCommand.description_embed.replace("{0}", role))
						.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
						.setColor(colors.general.danger);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });

				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				console.log(error)
				errorSendControls(error, interaction.client, interaction.guild, "\\reactionRole-system\\reactionroleremove.js", variables);
			}
		});
	},
};