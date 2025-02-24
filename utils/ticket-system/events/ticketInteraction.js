const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { errorSendControls, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const color = require('../../../bin/data/colors');
const { createTicketMessages, findByGuildAndAuthorIdTicketMessages, updateTicketMessages, findByMessageAndChannelAndGuildIdTicketMessages, findTicketOpened, createTicket, removeTicket, findByMessageAndChannelAndGuildIdTicket, findByMessageAndGuildIdTicketMessages } = require('../../../bin/service/DatabaseService');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, variables) {
    if (!interaction.guild) return;
    try {

      if (interaction.customId == 'ticketModal') {
        let data = await language.databaseCheck(interaction.guild.id);
        const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`, variables);
        const language_result = JSON.parse(langagues_path);
        
        let description = interaction.fields.getTextInputValue('ticketModalDescription');
        let title = interaction.fields.getTextInputValue('ticketModalTitle');

        const ticketSelectChannel = new ChannelSelectMenuBuilder()
          .setCustomId("ticketChannelSelect")
          .setPlaceholder(language_result.selectTicketChannel.placeholder)
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1);

        const row = new ActionRowBuilder()
          .addComponents(ticketSelectChannel);

        // CREO IL CANALE TEMPORANEO DI SETUP
        const initChannel = await interaction.guild.channels.create({
          name: 'setup-ticket',
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: interaction.guild.roles.everyone.id,
              deny: [PermissionFlagsBits.ViewChannel],
            }
          ],
        })


        const embedLog = new EmbedBuilder()
          .setDescription(`## ${language_result.selectTicketChannel.embed_title}\n${language_result.selectTicketChannel.description_embed}`)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setColor(color.general.blue)
          .setThumbnail(variables.getBotFooterIcon());

        const embedLogTwo = new EmbedBuilder()
          .setDescription(`## ${language_result.selectTicketChannel.embed_title}\n${language_result.selectTicketChannel.description_embed_two.replace("{0}", initChannel)}`)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setColor(color.general.blue)
          .setThumbnail(variables.getBotFooterIcon());

        await interaction.reply({ embeds: [embedLogTwo], flags: 64 });
        await initChannel.send({ embeds: [embedLog], components: [row] });

        await createTicketMessages(interaction.guild.id, interaction.user.id, title, description, interaction.channel.id, variables);

      }

      if (interaction.customId == "ticketChannelSelect") {
        let data = await language.databaseCheck(interaction.guild.id);
        const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`, variables);
        const language_result = JSON.parse(langagues_path);
        
        let channel = interaction.values[0];

        let checkSql = await findByGuildAndAuthorIdTicketMessages(interaction.guild.id, interaction.user.id, variables);
        checkSql = checkSql?.get({ plain: true });
        await interaction.message.delete();

        if (checkSql) {
          const ticketSelectCategory = new ChannelSelectMenuBuilder()
            .setCustomId("ticketCategorySelect")
            .setPlaceholder(language_result.selectCategoryTicket.placeholder)
            .addChannelTypes(ChannelType.GuildCategory)
            .setMinValues(1)
            .setMaxValues(1);

          const row = new ActionRowBuilder()
            .addComponents(ticketSelectCategory);

          const embedLog = new EmbedBuilder()
            .setDescription(`## ${language_result.selectCategoryTicket.embed_title}\n` + language_result.selectCategoryTicket.description_embed)
            .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
            .setColor(color.general.blue)
            .setThumbnail(variables.getBotFooterIcon());

          await interaction.reply({ embeds: [embedLog], components: [row] });
          await updateTicketMessages({channel_id: channel}, {where: {guild_id: interaction.guild.id, initAuthorId: interaction.user.id}});

        } else {
          const embedLog = new EmbedBuilder()
            .setDescription(`## ${language_result.errorDb.embed_title}\n` + language_result.errorDb.description_embed)
            .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
            .setColor(color.general.error)
            .setThumbnail(variables.getBotFooterIcon());
          await interaction.reply({ embeds: [embedLog], flags: 64 });
        }
      }

      if (interaction.customId == "ticketCategorySelect") {
        let data = await language.databaseCheck(interaction.guild.id);
        const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`, variables);
        const language_result = JSON.parse(langagues_path);

        let channel = interaction.values[0];

        let checkSql = await findByGuildAndAuthorIdTicketMessages(interaction.guild.id, interaction.user.id, variables);
        checkSql = checkSql?.get({ plain: true });
        await interaction.message.delete();

        if (checkSql) {
          const ticketTranscriptSelect = new ChannelSelectMenuBuilder()
            .setCustomId("ticketTranscriptSelect")
            .setPlaceholder(language_result.selectTranscriptTicket.placeholder)
            .addChannelTypes(ChannelType.GuildText)
            .setMinValues(1)
            .setMaxValues(1);

          const row = new ActionRowBuilder()
            .addComponents(ticketTranscriptSelect);

          const embedLog = new EmbedBuilder()
            .setDescription(`## ${language_result.selectTranscriptTicket.embed_title}\n` + language_result.selectTranscriptTicket.description_embed)
            .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
            .setColor(color.general.blue)
            .setThumbnail(variables.getBotFooterIcon());

          await interaction.reply({ embeds: [embedLog], components: [row] });

          await updateTicketMessages({category_id: channel}, {where: {guild_id: interaction.guild.id, initAuthorId: interaction.user.id}});
        } else {
          const embedLog = new EmbedBuilder()
            .setDescription(`## ${language_result.errorDb.embed_title}\n` + language_result.errorDb.description_embed)
            .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
            .setColor(color.general.error)
            .setThumbnail(variables.getBotFooterIcon());
          await interaction.reply({ embeds: [embedLog], flags: 64 });
        }
      }

      if (interaction.customId == "ticketTranscriptSelect") {
        let data = await language.databaseCheck(interaction.guild.id);
        const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`, variables);
        const language_result = JSON.parse(langagues_path);

        await interaction.deferReply();
        let channel = interaction.values[0];
        let checkSql = await findByGuildAndAuthorIdTicketMessages(interaction.guild.id, interaction.user.id, variables);
        checkSql = checkSql?.get({ plain: true });
        let initChannel = await interaction.guild.channels.fetch(checkSql.initChannel);
        let ticketChannel = await interaction.guild.channels.fetch(checkSql.channel_id);

        // MESSAGGIO CHE VIENE INVIATO AL CANALE SCELTO COME TICKET
        const embedLogMessage = new EmbedBuilder()
          .setDescription(`## ${language_result.endSetupTicket.embed_title}\n` + checkSql.initDescription)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setColor(color.general.olive)
          .setThumbnail(variables.getBotFooterIcon());
        let message = await ticketChannel.send({ embeds: [embedLogMessage] });

        // MESSAGGIO CHE VIENE INVIATO AL CANALE DI INIZIALIZZAZIONE
        const embedLog = new EmbedBuilder()
          .setDescription(`## ${language_result.endSetupTicket.embed_title}\n` + language_result.endSetupTicket.description_embed)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setColor(color.general.olive)
          .setThumbnail(variables.getBotFooterIcon());
        await initChannel.send({ content: `${interaction.user}`, embeds: [embedLog], flags: 64 });

        await updateTicketMessages({transcript_id: channel, message_id: message.id}, {where: {guild_id: interaction.guild.id, initAuthorId: interaction.user.id}});
        await interaction.channel.delete();
      }

      // INTERACTION TICKET SYSTEM START 
      if(interaction.type == 3) {
        let data = await language.databaseCheck(interaction.guild.id);
        const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`, variables);
        const language_result = JSON.parse(langagues_path);

        let checkChannelForInteraction = await findByMessageAndChannelAndGuildIdTicket(interaction.message?.id, interaction.guild?.id, interaction.message?.channelId, variables);
        checkChannelForInteraction = checkChannelForInteraction?.get({ plain: true });
        if (checkChannelForInteraction) {

          if (!await checkFeatureSystemDisabled(2)) return await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
          if (!await checkFeaturesIsEnabled(interaction.message.guild.id, 2, variables)) return await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);

          await interaction.deferReply({ ephemeral: true });
          const category = await interaction.guild.channels.fetch(checkChannelForInteraction.categoryId);

          // CONTROLLO SE IL TICKET E' GIA' APERTO 
          let checkAlreadyTicketOpen = await findTicketOpened(interaction.guild.id, interaction.user.id, interaction.message.id, interaction.customId, variables);
          checkAlreadyTicketOpen = checkAlreadyTicketOpen?.get({ plain: true });
          if (checkAlreadyTicketOpen) {
            const embedLog = new EmbedBuilder()
              .setDescription(`## ${language_result.ticketChannelDuplicate.embed_title}\n` + language_result.ticketChannelDuplicate.description_embed)
              .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
              .setColor(color.general.error)
              .setThumbnail(variables.getBotFooterIcon());

            await interaction.editReply({ embeds: [embedLog], flags: 64 });
            return;
          }

          // CONTROLLO I PERMESSI DEGLI AMMINISTRATORI DELLA CATEGORIA
          const permissionTicket = [];
          await category.permissionOverwrites?.cache.each(value => {
            permissionTicket.push({
              id: value.id,
              type: value.type,
              deny: value.deny,
              allow: value.allow
            })
          })
          // AGGIUNTA PERMESSI UTENTE
          permissionTicket.push({
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory],
          })
          // CREO IL CANALE
          const channel = await interaction.guild.channels.create({
            name: `${interaction.customId}-${interaction.user.username}`,
            parent: category,
            permissionOverwrites: permissionTicket,
            authorTicket: interaction.user,
          });

          // INVIO IL MESSAGGIO DI TICKET AL CANALE
          const buttonClaim = new ButtonBuilder()
            .setCustomId('ticketClaim')
            .setLabel(language_result.ticketButton.claim_ticket)
            .setStyle(ButtonStyle.Success);
          const buttonCancel = new ButtonBuilder()
            .setCustomId('ticketCancel')
            .setLabel(language_result.ticketButton.cancel_ticket)
            .setStyle(ButtonStyle.Danger);
          const buttonRow = new ActionRowBuilder().addComponents([buttonClaim, buttonCancel]);
          const embedChannel = new EmbedBuilder()
            .setDescription(`## ${language_result.ticketChannelSend.embed_title}\n` + language_result.ticketChannelSend.description_embed)
            .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
            .setColor(color.general.olive)
            .setThumbnail(variables.getBotFooterIcon());
          const messageTicket = await channel.send({ content: "@everyone", embeds: [embedChannel], components: [buttonRow] })
          await createTicket(interaction.guild.id, interaction.user.id, messageTicket.id, interaction.customId, checkChannelForInteraction.message_id, channel.id, variables);

          // RISPONDO ALL'INTERAZIONE
          const embedLog = new EmbedBuilder()
            .setDescription(`## ${language_result.ticketInteractionSend.embed_title}\n` + language_result.ticketInteractionSend.description_embed.replace("{0}", channel))
            .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
            .setColor(color.general.olive)
            .setThumbnail(variables.getBotFooterIcon());
          await interaction.editReply({ embeds: [embedLog], flags: 64 });
        }
      }

      // INTERACTION TICKET SYSTEM END
      // TICKET CLAIM
      if (interaction.customId == "ticketClaim") {
        let data = await language.databaseCheck(interaction.guild.id);
        const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`, variables);
        const language_result = JSON.parse(langagues_path);

        if (!await checkFeatureSystemDisabled(2)) return await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
        if (!await checkFeaturesIsEnabled(interaction.message.guild.id, 2, variables)) return await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
        await returnPermission(interaction, "ticketClaim", async result => {
          if (result) {
            let checkSql = await findByMessageAndChannelAndGuildIdTicketMessages(interaction.guild.id, interaction.message.id, variables);
            checkSql = checkSql?.get({ plain: true });

            if (checkSql) {
              const permissionTicket = [];
              // AGGIORNO I PERMESSI PER L'AMMINISTRATORE E L'UTENTE
              permissionTicket.push({
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory],
                type: 1,
              }, {
                id: checkSql.author_id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory],
                type: 1,
              }, {
                id: interaction.guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory],
                type: 0,
              })

              await interaction.channel.edit({ permissionOverwrites: permissionTicket });

              // INVIO IL MESSAGGIO DI TICKET AL CANALE
              const buttonClose = new ButtonBuilder()
                .setCustomId('ticketClose')
                .setLabel(language_result.ticketButton.close_ticket)
                .setStyle(ButtonStyle.Danger);
              const buttonRow = new ActionRowBuilder().addComponents([buttonClose]);

              const embedChannel = new EmbedBuilder()
                .setDescription(`## ${language_result.ticketChannelClaim.embed_title}\n` + language_result.ticketChannelClaim.description_embed.replace("{0}", interaction.user))
                .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
                .setColor(color.general.olive)
                .setThumbnail(variables.getBotFooterIcon());
              await interaction.message.edit({ embeds: [embedChannel], components: [buttonRow] })

              const joinEmbed = new EmbedBuilder()
                .setDescription(language_result.ticketStaffJoin.description_embed.replace("{0}", interaction.user))
                .setColor(color.general.olive);

              await interaction.reply({ embeds: [joinEmbed] })

              // PROVO A INVIARE UN MESSAGGIO AL AUTORE DEL TICKET
              try {

                const user = await interaction.guild.members.fetch(checkSql.author_id);

                const embedAuthor = new EmbedBuilder()
                  .setDescription(`## ${language_result.ticketClaimToAuthor.embed_title}\n` + language_result.ticketClaimToAuthor.description_embed.replace("{0}", interaction.channel).replace("{1}", interaction.user))
                  .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
                  .setColor(color.general.olive)
                  .setThumbnail(variables.getBotFooterIcon());
                user.send({ embeds: [embedAuthor] });
              } catch (error) {
                return;
              }
            }
          }
          else {
            await noHavePermission(interaction, language_result, variables);
          }
        });
      }
      // END TICKET CLAIM

      // TICKET CANCEL
      if (interaction.customId == "ticketCancel") {
        let data = await language.databaseCheck(interaction.guild.id);
        const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`, variables);
        const language_result = JSON.parse(langagues_path);

        if (!await checkFeatureSystemDisabled(2)) return await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
        if (!await checkFeaturesIsEnabled(interaction.message.guild.id, 2, variables)) return await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
        await returnPermission(interaction, "ticketCancel", async result => {
          if (result) {
            let checkSql = await findByMessageAndChannelAndGuildIdTicketMessages(interaction.guild.id, interaction.message.id, variables);
            checkSql = checkSql?.get({ plain: true });

            if (checkSql) {
              // PROVO A INVIARE UN MESSAGGIO AL AUTORE DEL TICKET
              try {
                const user = await interaction.guild.members.fetch(checkSql.author_id);

                const embedAuthor = new EmbedBuilder()
                  .setDescription(`## ${language_result.ticketCloseToAuthor.embed_title}\n` + language_result.ticketCloseToAuthor.description_embed.replace("{0}", interaction.user))
                  .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
                  .setColor(color.general.olive)
                  .setThumbnail(variables.getBotFooterIcon());
                await user.send({ embeds: [embedAuthor] });
              } catch (error) {
                // passa avanti
              }
              await removeTicket(checkSql.id, variables);
              await interaction.deferReply();
              await interaction.channel.delete();
            }
          }
          else {
            await noHavePermission(interaction, language_result, variables);
          }
        });
      }
      // END TICKET CANCEL

      // TICKET CLOSE
      if (interaction.customId == "ticketClose") {
        let data = await language.databaseCheck(interaction.guild.id);
        const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`, variables);
        const language_result = JSON.parse(langagues_path);

        if (!await checkFeatureSystemDisabled(2)) return await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
        if (!await checkFeaturesIsEnabled(interaction.message.guild.id, 2, variables)) return await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
        await returnPermission(interaction, "ticketClose", async result => {
          if (result) {
            let checkSql = await findByMessageAndChannelAndGuildIdTicketMessages(interaction.guild.id, interaction.message.id, variables);
            checkSql = checkSql?.get({ plain: true });

            if (checkSql) {
              const modal = new ModalBuilder()
                .setCustomId("ticketCloseModal")
                .setTitle(language_result.ticketCloseModal.embed_title);

              const ticketDescription = new TextInputBuilder()
                .setCustomId('ticketCloseModalDescription')
                .setMaxLength(1000)
                .setLabel(language_result.ticketCloseModal.modalDescriptionDescription)
                .setPlaceholder(language_result.ticketCloseModal.modalDescriptionPlaceHolder)
                .setStyle(TextInputStyle.Paragraph);

              const ticketDescriptionRow = new ActionRowBuilder().addComponents(ticketDescription);

              modal.addComponents(ticketDescriptionRow);

              await interaction.showModal(modal);
            }
          }
          else {
            await noHavePermission(interaction, language_result, variables);
          }
        });
      }
      // END TICKET CLOSE

      // TICKET CLOSE MODAL
      if (interaction.customId == "ticketCloseModal") {
        let data = await language.databaseCheck(interaction.guild.id);
        const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`, variables);
        const language_result = JSON.parse(langagues_path);

        if (!await checkFeatureSystemDisabled(2)) return await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
        if (!await checkFeaturesIsEnabled(interaction.message.guild.id, 2, variables)) return await noEnabledFunc(interaction, language_result.noPermission.description_embed_no_features);
        await returnPermission(interaction, "ticketClose", async result => {
          if (result) {
            let checkSql = await findByMessageAndChannelAndGuildIdTicketMessages(interaction.guild.id, interaction.message.id, variables);
            checkSql = checkSql?.get({ plain: true });

            let checkSqlToMessage = await findByMessageAndGuildIdTicketMessages(checkSql.ticketSystemMessage_id, interaction.guild.id, variables)
            checkSqlToMessage = checkSqlToMessage?.get({ plain: true });
            if (checkSql && checkSqlToMessage) {
              let user; //Controllo se un utente esiste ancora nella guild
              try {
                 user = await interaction.guild.members.fetch(checkSql.author_id);
              } catch {
                user = language_result.ticketTranscription.no_user;
              }

              let description = interaction.fields.getTextInputValue('ticketCloseModalDescription');
              const messageCache = await interaction.channel.messages.fetch();
              let messageWrite = "";

              await messageCache.sort((a, b) => a.createdTimestamp - b.createdTimestamp).each(value => {
                if (value.author.id != interaction.client.user.id) {
                  messageWrite += `${value.author.username}: ${value.content}\n`;
                };
              })
              writeFileSync(`./utils/ticket-system/temporary_transcript/${checkSql.id}.txt`, messageWrite);

              // INVIO IL MESSAGGIO DI TRANSCRIZIONE
              console.log(checkSqlToMessage)
              console.log(checkSqlToMessage.transcript_id)
              const transcriptChannel = await interaction.guild.channels.fetch(checkSqlToMessage.transcript_id);
              if(!transcriptChannel || checkSqlToMessage.transcript_id == null) return;


              const embedTranscription = new EmbedBuilder()
                .setDescription(`## ${language_result.ticketTranscription.embed_title}\n`)
                .setFields([
                  { name: language_result.ticketTranscription.prefix, value: `${checkSql.ticketPrefix}` },
                  { name: language_result.ticketTranscription.user, value: `${user} (${checkSql.author_id})`, inline: true },
                  { name: language_result.ticketTranscription.admin, value: `${interaction.user} (${interaction.user.id})`, inline: true },
                  { name: language_result.ticketTranscription.reason, value: `${description}` },
                ])
                .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
                .setColor(color.general.danger)
                .setThumbnail(variables.getBotFooterIcon());


              const transcriptFile = new AttachmentBuilder(`./utils/ticket-system/temporary_transcript/${checkSql.id}.txt`, { name: `${user}.txt` });

              if (messageWrite.length > 0) {
                await transcriptChannel.send({ embeds: [embedTranscription], files: [transcriptFile] });
              } else {
                await transcriptChannel.send({ embeds: [embedTranscription] });
              }

              await removeTicket(checkSql.id, variables);
              
              await interaction.deferReply();
              await interaction.channel.delete();

              try {
                const embedAuthor = new EmbedBuilder()
                  .setDescription(`## ${language_result.ticketTranscription.embed_title}\n`)
                  .addFields([{ name: language_result.ticketTranscription.reason, value: `${description}` }])
                  .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
                  .setColor(color.general.danger);

                if (messageWrite.length > 0) {
                  embedAuthor.setDescription(language_result.ticketTranscription.ticketClose.replace("{0}", interaction.user));
                  await user.send({ embeds: [embedAuthor], files: [transcriptFile] });
                } else {
                  embedAuthor.setDescription(language_result.ticketTranscription.ticketCloseNoTranscription.replace("{0}", interaction.user));
                  await user.send({ embeds: [embedAuthor] });
                }
              } catch (error) {
                // passa avanti
              }
              unlinkSync(`./utils/ticket-system/temporary_transcript//${checkSql.id}.txt`);
            }
          }
          else {
            await noHavePermission(interaction, language_result, variables);
          }
        });
      }
      // END TICKET CLOSE MODAL

    }
    catch (error) {
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\ticket-system\\ticketInteraction.js", variables);
    }
  },
};