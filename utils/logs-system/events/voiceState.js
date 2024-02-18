const { Events, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT voiceStateJoin_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ----------------

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    let customEmoji = await getEmojifromUrl(oldState.client, "voicestate");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.getValueDatabase(sqlEnabledFeature, newState.guild.id, (result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.getValueDatabase(sqlChannelId_log, newState.guild.id, async (result) => {
        try {

          if (!result?.voiceStateJoin_channel) return;
          if (result.voiceStateJoin_channel?.length < 5) return;
          // CONTROLLO DELLA LINGUA
          if (oldState.guild?.id) {
            let data = await language.databaseCheck(oldState.guild.id);
            const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
            const language_result = JSON.parse(langagues_path);

            // UN UTENTE SI E' SPOSTATO DA UN CANALE A UN ALTRO
            if (oldState.channel?.id && newState.channel?.id && oldState.channel?.id != newState.channel?.id) {
              let channel = await newState.guild.channels.fetch(result.voiceStateJoin_channel);
              // CREO IL MESSAGGIO EMBED DA MANDARE
              const embedLog = new EmbedBuilder()
                .setAuthor({ name: `${language_result.voiceState.embed_title}`, iconURL: customEmoji })
                .addFields(
                  { name: `${language_result.voiceState.old_channel}`, value: `${oldState.channel}`, inline: true },
                  { name: `${language_result.voiceState.new_channel}`, value: `${newState.channel}`, inline: true })
                .setDescription(language_result.voiceState.move_to.replace("{1}", oldState.member.user))
                .setFooter({ text: `${language_result.voiceState.embed_footer}`, iconURL: `${language_result.voiceState.embed_icon_url}` })
                .setColor(0x2a647d);
              channel.send({ embeds: [embedLog] });

            }
            // UN UTENTE HA EFFETTUATO L'ACCESSO IN UN NUOVO CANALE
            if (!oldState.channel?.id && newState.channel?.id) {
              let channel = await newState.guild.channels.fetch(result.voiceStateJoin_channel)
              // CREO IL MESSAGGIO EMBED DA MANDARE
              const embedLog = new EmbedBuilder()
                .setAuthor({ name: `${language_result.voiceState.embed_title}`, iconURL: customEmoji })
                .setDescription(language_result.voiceState.join_now
                  .replace("{1}", newState.member.user)
                  .replace("{2}", newState.channel))
                .setFooter({ text: `${language_result.voiceState.embed_footer}`, iconURL: `${language_result.voiceState.embed_icon_url}` })
                .setColor(0x358f38);
              channel.send({ embeds: [embedLog] });

            }
            // UN UTENTE SI E' DISCONNESSO DAI CANALI VOCALI
            if (oldState.channel?.id && !newState.channel?.id) {
              let channel = await newState.guild.channels.fetch(result.voiceStateJoin_channel)
              // CREO IL MESSAGGIO EMBED DA MANDARE
              const embedLog = new EmbedBuilder()
                .setAuthor({ name: `${language_result.voiceState.embed_title}`, iconURL: customEmoji })
                .setDescription(language_result.voiceState.left_now
                  .replace("{1}", oldState.member.user)
                  .replace("{2}", oldState.channel))
                .setFooter({ text: `${language_result.voiceState.embed_footer}`, iconURL: `${language_result.voiceState.embed_icon_url}` })
                .setColor(0x7a3131);
              channel.send({ embeds: [embedLog] });
            }
          }
        }
        catch (error) {
          errorSendControls(error, oldState.client, oldState.guild, "\\logs_system\\VoiceState.js");
        }
      });
    });
  },
};