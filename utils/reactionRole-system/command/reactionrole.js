// Code: utils/reactionRole-system/command/reactionrole.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file reactionrole.js
 * @module reactionrole
 * @description Questo file gestisce il comando per assegnare i reaction roles
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emojis = require('../../../bin/data/emoji');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { createRole, createReaction, findByGuildIdAndMessageIdAndEmojiReactions } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionrole')
		.setDescription('Use this command to set your reaction roles')
		.addStringOption(message =>
			message
				.setName('message')
				.setDescription('The message ID to which you want to assign the reaction role')
				.setRequired(true)
		)
		.addStringOption(emoji =>
			emoji
				.setName('emoji')
				.setDescription('The emoji to which the user must react for the reaction role')
				.setRequired(true))
		.addRoleOption(role =>
			role
				.setName('role')
				.setDescription('The role to be assigned with the reaction role')
				.setRequired(true)
		),
	async execute(interaction, variables) {
		const message = interaction.options.data[0].value;
		const emoji = interaction.options.data[1].value;
		const role = interaction.options.data[2].role;
		const roleId = interaction.options.data[2].value;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id, variables);
		const langagues_path = readFileSync(`./languages/reactionRole-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "reactionrole", async result => {
			try {
				if (result) {
					if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 5, true, language_result.noPermission.description_embed_no_features_by_system, 
						language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
						language_result.noPermission.description_embed_no_features, variables)) return;

					// CONTROLLO SE IL RUOLO SI TROVA SOTTO AL RUOLO DA IMPOSTARE
					if (interaction.guild.roles.botRoleFor(interaction.client.user).rawPosition < role.rawPosition) {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.addCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
							.setDescription(language_result.addCommand.description_embed_missingpermissions.replace("{0}", `${interaction.guild.roles.botRoleFor(interaction.client.user)}`))
							.setFooter({ text: `${language_result.addCommand.embed_footer}`, iconURL: `${language_result.addCommand.embed_icon_url}` })
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
							.setAuthor({ name: `${language_result.addCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
							.setDescription(language_result.addCommand.description_embed_channelnotfound)
							.setFooter({ text: `${language_result.addCommand.embed_footer}`, iconURL: `${language_result.addCommand.embed_icon_url}` })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						return;
					}

					let checkReactionAlreadySet = await findByGuildIdAndMessageIdAndEmojiReactions(interaction.guild.id, message, emoji, variables);
					checkReactionAlreadySet = checkReactionAlreadySet?.get({ plain: true });
					if (checkReactionAlreadySet) {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.addCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
							.setDescription(language_result.addCommand.description_embed_alreadyset)
							.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						return;
					}
					// IMPOSTO LA REACTION ALTRIMENTI ANNULLO TUTTO
					try {
						await messageResolve.react(emoji);
					}
					catch {
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.addCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
							.setDescription(language_result.addCommand.description_embed_emojinotfound)
							.setFooter({ text: `${language_result.addCommand.embed_footer}`, iconURL: `${language_result.addCommand.embed_icon_url}` })
							.setColor(colors.general.error);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
						return;
					}
					await createRole(roleId, interaction.guild.id, variables);
					await createReaction(roleId, interaction.guild.id, emoji, message, variables);

					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.addCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
						.setDescription(language_result.addCommand.description_embed.replace("{0}", role))
						.setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
						.setColor(colors.general.success);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });

				}
				else {
					await noHavePermission(interaction, language_result, variables);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\reactionRole-system\\reactionrole.js", variables);
			}
		});
	},
};