const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { readDbAllWith2Params, runDb, readDbWith3Params, readDbWith4Params, readDb, readDbAllWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.guild) return;
    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id);
      const langagues_path = readFileSync(`./languages/giveaway-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (interaction.customId == 'giveawaybutton') {
        // DEFINIZIONI DELLE VARIABILI
        let channel = interaction.channel;
        let guild = interaction.guild;
        let message = interaction.message;
        let user = interaction.user;

        // CONTROLLO IL DATABASE PER VERIFICARE SE IL
        // GIVEAWAY EFFETTIVAMENTE ESISTE
        let checkGiveaway = await readDbWith3Params('SELECT * FROM giveaway_system_container WHERE guildId = ? AND messageId = ? AND channelId = ?', guild.id, message.id, channel.id);

        const customEmoji = await getEmojifromUrl(interaction.client, "giveaway");
        if (checkGiveaway) {
          // SE ESISTE IL GIVEAWAY
          // CONTROLLO SE L'UTENTE E' GIA' ISCRITTO AL GIVEAWAY
          let checkUserAlreadyPartecipans = await readDbWith3Params('SELECT * FROM giveaway_system_partecipants WHERE guildId = ? AND messageId = ? AND userId = ?', guild.id, message.id, user.id);
          if (!checkUserAlreadyPartecipans) {
            let checkSlotsPartecipants = await readDbAllWith2Params('SELECT * FROM giveaway_system_partecipants WHERE guildId = ? AND messageId = ?', guild.id, message.id);
            //SE L'UTENTE NON PARTECIPA
            if (checkSlotsPartecipants.length < checkGiveaway.slots) {
              // SE GLI SLOTS SONO ANCORA DISPONIBILI
              await runDb("INSERT INTO giveaway_system_partecipants (guildId, channelId, messageId, userId) VALUES (?, ?, ?, ?)", interaction.guild.id, interaction.channel.id, message.id, user.id);
              // CONTROLLO SE LA LUNGHEZZA DEI PARTECIPANTI
              let checkDataPartecipants = await readDbAllWith3Params('SELECT * FROM giveaway_system_partecipants WHERE guildId = ? AND messageId = ? AND channelId = ?', guild.id, message.id, channel.id);


              // RISPONDO ALL'INTERAZIONE
              const embedLog = new EmbedBuilder()
                .setAuthor({ name: `${language_result.giveawayPartecipants.embed_title}`, iconURL: customEmoji })
                .setDescription(language_result.giveawayPartecipants.interactionResponse)
                .setFooter({ text: `${language_result.giveawayPartecipants.embed_footer}`, iconURL: `${language_result.giveawayPartecipants.embed_icon_url}` })
                .setColor(0xa22297);
              await interaction.reply({ embeds: [embedLog], ephemeral: true });

            } else {
              //SE NON CI SONO SLOTS DISPONIBILI
              const embedLog = new EmbedBuilder()
                .setAuthor({ name: `${language_result.giveawayPartecipants.embed_title}`, iconURL: customEmoji })
                .setDescription(language_result.giveawayPartecipants.noSlots)
                .setFooter({ text: `${language_result.giveawayPartecipants.embed_footer}`, iconURL: `${language_result.giveawayPartecipants.embed_icon_url}` })
                .setColor(0xa22297);
              await interaction.reply({ embeds: [embedLog], ephemeral: true });
            }
          } else {
            //SE L'UTENTE GIA' PARTECIPA
            const embedLog = new EmbedBuilder()
              .setAuthor({ name: `${language_result.giveawayPartecipants.embed_title}`, iconURL: customEmoji })
              .setDescription(language_result.giveawayPartecipants.alreadyPartecipants)
              .setFooter({ text: `${language_result.giveawayPartecipants.embed_footer}`, iconURL: `${language_result.giveawayPartecipants.embed_icon_url}` })
              .setColor(0xa22297);
            await interaction.reply({ embeds: [embedLog], ephemeral: true });
          }
        } else {
          // SE NON ESISTE IL GIVEAWAY
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.giveawayNotFound.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.giveawayNotFound.description_embed)
            .setFooter({ text: `${language_result.giveawayNotFound.embed_footer}`, iconURL: `${language_result.giveawayNotFound.embed_icon_url}` })
            .setColor(0x7a090c);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
        }

      }

    }
    catch (error) {
      console.log(error)
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\giveaway-system\\giveawayInteractions.js");
    }
  },
};