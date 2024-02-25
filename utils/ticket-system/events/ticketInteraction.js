const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, TextChannel, ChannelType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDbAllWith2Params, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id);
      const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (interaction.customId == 'ticketModal') {
        let description = interaction.fields.getTextInputValue('ticketModalDescription');
        let title = interaction.fields.getTextInputValue('ticketModalTitle');

        const checkSql = await readDbAllWith2Params(`SELECT * from ticket_system_message WHERE initAuthorId = ? AND guildId = ?`, interaction.user.id, interaction.guild.id);

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


        let customEmoji = await getEmojifromUrl(interaction.client, "ticket");
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.selectTicketChannel.embed_title}`, iconURL: customEmoji })
          .setDescription(language_result.selectTicketChannel.description_embed)
          .setFooter({ text: `${language_result.selectTicketChannel.embed_footer}`, iconURL: `${language_result.selectTicketChannel.embed_icon_url}` })
          .setColor(0x03cffc);

        const embedLogTwo = new EmbedBuilder()
          .setAuthor({ name: `${language_result.selectTicketChannel.embed_title}`, iconURL: customEmoji })
          .setDescription(language_result.selectTicketChannel.description_embed_two.replace("{0}", initChannel))
          .setFooter({ text: `${language_result.selectTicketChannel.embed_footer}`, iconURL: `${language_result.selectTicketChannel.embed_icon_url}` })
          .setColor(0x03cffc);

        await interaction.reply({embeds: [embedLogTwo], ephemeral: true});
        await initChannel.send({ embeds: [embedLog], components: [row] });

        await runDb(`INSERT INTO ticket_system_message (guildId, initAuthorId, initDescription, initTitle, initChannel) VALUES (?, ?, ?, ?, ?)`, interaction.guild.id, interaction.user.id, description, title, interaction.channel.id);

      }

      if (interaction.customId == "ticketChannelSelect") {
        let channel = interaction.values[0];

        const checkSql = await readDbAllWith2Params(`SELECT * from ticket_system_message WHERE initAuthorId = ? AND guildId = ?`, interaction.user.id, interaction.guild.id);
        await interaction.message.delete();

        if (checkSql.length > 0) {
          const ticketSelectCategory = new ChannelSelectMenuBuilder()
            .setCustomId("ticketCategorySelect")
            .setPlaceholder(language_result.selectCategoryTicket.placeholder)
            .addChannelTypes(ChannelType.GuildCategory)
            .setMinValues(1)
            .setMaxValues(1);

          const row = new ActionRowBuilder()
            .addComponents(ticketSelectCategory);

          let customEmoji = await getEmojifromUrl(interaction.client, "ticket");
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.selectCategoryTicket.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.selectCategoryTicket.description_embed)
            .setFooter({ text: `${language_result.selectCategoryTicket.embed_footer}`, iconURL: `${language_result.selectCategoryTicket.embed_icon_url}` })
            .setColor(0x03cffc);

          await interaction.reply({ embeds: [embedLog], components: [row] });

          await runDb(`UPDATE ticket_system_message SET channelId = ? WHERE guildId = ? AND initAuthorId = ?`, channel, interaction.guild.id, interaction.user.id);

        } else {
          let customEmoji = await getEmojifromUrl(interaction.client, "ticket");
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.errorDb.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.errorDb.description_embed)
            .setFooter({ text: `${language_result.errorDb.embed_footer}`, iconURL: `${language_result.errorDb.embed_icon_url}` })
            .setColor(0x4287f5);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
        }
      }
      if (interaction.customId == "ticketCategorySelect") {
        let channel = interaction.values[0];

        const checkSql = await readDbAllWith2Params(`SELECT * from ticket_system_message WHERE initAuthorId = ? AND guildId = ?`, interaction.user.id, interaction.guild.id);
        await interaction.message.delete();

        if (checkSql.length > 0) {
          const ticketTranscriptSelect = new ChannelSelectMenuBuilder()
            .setCustomId("ticketTranscriptSelect")
            .setPlaceholder(language_result.selectTranscriptTicket.placeholder)
            .addChannelTypes(ChannelType.GuildText)
            .setMinValues(1)
            .setMaxValues(1);

          const row = new ActionRowBuilder()
            .addComponents(ticketTranscriptSelect);

          let customEmoji = await getEmojifromUrl(interaction.client, "ticket");
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.selectTranscriptTicket.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.selectTranscriptTicket.description_embed)
            .setFooter({ text: `${language_result.selectTranscriptTicket.embed_footer}`, iconURL: `${language_result.selectTranscriptTicket.embed_icon_url}` })
            .setColor(0x03cffc);

          await interaction.reply({ embeds: [embedLog], components: [row] });

          await runDb(`UPDATE ticket_system_message SET categoryId = ? WHERE guildId = ? AND initAuthorId = ?`, channel, interaction.guild.id, interaction.user.id);
        } else {
          let customEmoji = await getEmojifromUrl(interaction.client, "ticket");
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.errorDb.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.errorDb.description_embed)
            .setFooter({ text: `${language_result.errorDb.embed_footer}`, iconURL: `${language_result.errorDb.embed_icon_url}` })
            .setColor(0x4287f5);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
        }
      }
      if(interaction.customId == "ticketTranscriptSelect") {
        let channel = interaction.values[0];
        let customEmoji = await getEmojifromUrl(interaction.client, "ticket");
        const checkSql = await readDbAllWith2Params(`SELECT * from ticket_system_message WHERE initAuthorId = ? AND guildId = ?`, interaction.user.id, interaction.guild.id);
        let initChannel = await interaction.guild.channels.fetch(checkSql[0].initChannel);
        let ticketChannel = await interaction.guild.channels.fetch(checkSql[0].channelId);

        // MESSAGGIO CHE VIENE INVIATO AL CANALE SCELTO COME TICKET
        const embedLogMessage = new EmbedBuilder()
          .setAuthor({ name: `${language_result.endSetupTicket.embed_title}`, iconURL: customEmoji })
          .setDescription(checkSql[0].initDescription)
          .setFooter({ text: `${language_result.endSetupTicket.embed_footer}`, iconURL: `${language_result.endSetupTicket.embed_icon_url}` })
          .setColor(0x4287f5);
        let message = await ticketChannel.send({embeds: [embedLogMessage]});

        // MESSAGGIO CHE VIENE INVIATO AL CANALE DI INIZIALIZZAZIONE
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.endSetupTicket.embed_title}`, iconURL: customEmoji })
          .setDescription(language_result.endSetupTicket.description_embed)
          .setFooter({ text: `${language_result.endSetupTicket.embed_footer}`, iconURL: `${language_result.endSetupTicket.embed_icon_url}` })
          .setColor(0x1b9e31);
        await initChannel.send({content: `${interaction.user}`, embeds: [embedLog], ephemeral: true });

        await runDb(`UPDATE ticket_system_message SET transcriptId = ?, initAuthorId = ?, messageId = ? WHERE guildId = ? AND initAuthorId = ?`, channel, null, message.id, interaction.guild.id, interaction.user.id);

        await interaction.channel.delete();

      }
      console.log(interaction)
    }
    catch (error) {
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\ticket-system\\ticketInteraction.js");
    }
  },
};