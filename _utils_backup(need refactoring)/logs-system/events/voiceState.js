const { Events, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

// QUERY DEFINITION
let sql = `SELECT * FROM logs_system WHERE guilds_id = ?`;
// ------------ //

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    let customEmoji = emoji.general.voiceMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, oldState.guild.id);
    if (!resultDb) return;
    if (!await checkFeaturesIsEnabled(oldState.guild, 1)) return;
    if (!resultDb["voice_state_channel"]) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (oldState.guild?.id) {
        let data = await language.databaseCheck(oldState.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        // UN UTENTE SI E' SPOSTATO DA UN CANALE A UN ALTRO
        if (oldState.channel?.id && newState.channel?.id && oldState.channel?.id != newState.channel?.id) {
          let channel = await newState.guild.channels.fetch(resultDb["voice_state_channel"]);
          // CREO IL MESSAGGIO EMBED DA MANDARE
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.voiceState.embed_title}`, iconURL: customEmoji })
            .addFields(
              { name: `${language_result.voiceState.old_channel}`, value: `${oldState.channel}`, inline: true },
              { name: `${language_result.voiceState.new_channel}`, value: `${newState.channel}`, inline: true })
            .setDescription(language_result.voiceState.move_to.replace("{1}", oldState.member.user))
            .setFooter({ text: `${language_result.voiceState.embed_footer}`, iconURL: `${language_result.voiceState.embed_icon_url}` })
            .setColor(colors.general.aquamarine);
          channel.send({ embeds: [embedLog] });

        }
        // UN UTENTE HA EFFETTUATO L'ACCESSO IN UN NUOVO CANALE
        if (!oldState.channel?.id && newState.channel?.id) {
          let channel = await newState.guild.channels.fetch(resultDb["voice_state_channel"])
          // CREO IL MESSAGGIO EMBED DA MANDARE
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.voiceState.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.voiceState.join_now
              .replace("{1}", newState.member.user)
              .replace("{2}", newState.channel))
            .setFooter({ text: `${language_result.voiceState.embed_footer}`, iconURL: `${language_result.voiceState.embed_icon_url}` })
            .setColor(colors.general.success);
          channel.send({ embeds: [embedLog] });

        }
        // UN UTENTE SI E' DISCONNESSO DAI CANALI VOCALI
        if (oldState.channel?.id && !newState.channel?.id) {
          let channel = await newState.guild.channels.fetch(resultDb["voice_state_channel"])
          // CREO IL MESSAGGIO EMBED DA MANDARE
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.voiceState.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.voiceState.left_now
              .replace("{1}", oldState.member.user)
              .replace("{2}", oldState.channel))
            .setFooter({ text: `${language_result.voiceState.embed_footer}`, iconURL: `${language_result.voiceState.embed_icon_url}` })
            .setColor(colors.general.error);
          channel.send({ embeds: [embedLog] });
        }
      }
    }
    catch (error) {
      errorSendControls(error, oldState.client, oldState.guild, "\\logs_system\\VoiceState.js");
    }
  },
};