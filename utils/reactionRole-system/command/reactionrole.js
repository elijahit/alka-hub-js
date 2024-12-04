const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emojis = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const checkRolesRelation = require('../../../bin/functions/checkRolesRelation');


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
	async execute(interaction) {
		const message = interaction.options.data[0].value;
		const emoji = interaction.options.data[1].value;
		const role = interaction.options.data[2].role;
		const roleId = interaction.options.data[2].value;

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/reactionRole-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "reactionrole", async result => {
			try {
				if (result) {

					if (await checkFeaturesIsEnabled(interaction.guild.id, 5)) {
						// CONTROLLO SE IL RUOLO SI TROVA SOTTO AL RUOLO DA IMPOSTARE
						if(interaction.guild.roles.botRoleFor(interaction.client.user).rawPosition < role.rawPosition) {
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

						const checkReactionAlreadySet = await readDb(`SELECT * 
						FROM reaction_roles rs
						JOIN roles r ON rs.roles_id = r.roles_id
						WHERE rs.roles_id = ? AND rs.message_id = ? AND rs.emoji = ? AND (r.guilds_id = ? OR r.guilds_id IS NULL)`, roleId, message, emoji, interaction.guild.id);

						if (checkReactionAlreadySet) {
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.addCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
								.setDescription(language_result.addCommand.description_embed_alreadyset)
								.setFooter({ text: `${language_result.addCommand.embed_footer}`, iconURL: `${language_result.addCommand.embed_icon_url}` })
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
						checkRolesRelation(roleId, interaction.guild.id);
						await runDb('INSERT INTO reaction_roles (roles_id, emoji, message_id) VALUES (?, ?, ?)', roleId, emoji, message);

						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.addCommand.embed_title}`, iconURL: emojis.reactionRoleSystem.main })
							.setDescription(language_result.addCommand.description_embed.replace("{0}", role))
							.setFooter({ text: `${language_result.addCommand.embed_footer}`, iconURL: `${language_result.addCommand.embed_icon_url}` })
							.setColor(colors.general.success);
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
				errorSendControls(error, interaction.client, interaction.guild, "\\reactionRole-system\\reactionrole.js");
			}
		});
	},
};