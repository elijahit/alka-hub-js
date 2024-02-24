const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, TextChannel, ChannelType, EmbedBuilder} = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      if (interaction.customId == 'ticketModal') {
        let description = interaction.fields.getTextInputValue('ticketModalDescription');
        let title = interaction.fields.getTextInputValue('ticketModalTitle');
        
        // CONTROLLO DELLA LINGUA
        let data = await language.databaseCheck(interaction.guild.id);
        const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        const ticketSelectChannel = new ChannelSelectMenuBuilder()
          .setCustomId("ticketChannelSelect")
          .setPlaceholder("Seleziona il canale di embed del ticket")
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1);
        
        const row = new ActionRowBuilder()
          .addComponents(ticketSelectChannel);
        
        let customEmoji = await getEmojifromUrl(interaction.client, "ticket");
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.selectTicketChannel.embed_title}`, iconURL: customEmoji })
          .setDescription(language_result.selectTicketChannel.description_embed)
          .setFooter({ text: `${language_result.selectTicketChannel.embed_footer}`, iconURL: `${language_result.selectTicketChannel.embed_icon_url}` })
          .setColor(0x03cffc);

        await runDb(`INSERT INTO ticket_system_message (guildId, initAuthorId, initDescription, initTitle) VALUES (?, ?, ?, ?)`, interaction.guild.id, interaction.user.id, description, title);
        await interaction.reply({embeds: [embedLog], components: [row], ephemeral: true});

      }
      
      if(interaction.customId == "ticketChannelSelect") {
        console.log(description, title)
      }
    }
    catch (error) {
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\ticket-system\\ticketInteraction.js");
    }
  },
};