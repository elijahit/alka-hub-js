const { Events, EmbedBuilder, Embed } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT voiceStateJoin_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ----------------

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.db.get(sqlEnabledFeature, [newState.guild.id], (_, result) => {
      if(result.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.db.get(sqlChannelId_log, [newState.guild.id], (_, result) => {
        // CONTROLLO DELLA LINGUA
        if (oldState.guild?.id) {
          language.databaseCheck(oldState.guild.id)
            .then(data => {
              const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
              const language_result = JSON.parse(langagues_path);

              // UN UTENTE SI E' SPOSTATO DA UN CANALE A UN ALTRO
              if (oldState.channel?.id && newState.channel?.id) {
                newState.guild.channels.fetch(result.voiceStateJoin_channel)
                  .then(channel => {
                    // CREO IL MESSAGGIO EMBED DA MANDARE
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: "Alka Hub | Logs System 🔊" })
                      .addFields(
                        {name: `${language_result.logs_system.old_channel}`, value: `${oldState.channel}`, inline: true},
                        {name: `${language_result.logs_system.new_channel}`, value: `${newState.channel}`, inline: true})
                      .setDescription(language_result.logs_system.move_to.replace("{1}", oldState.member.user))
                      .setColor(0x2a647d);
                    channel.send({ embeds: [embedLog] });
                  })
                  .catch(console.error);
              }
              // UN UTENTE HA EFFETTUATO L'ACCESSO IN UN NUOVO CANALE
              if(!oldState.channel?.id && newState.channel?.id) {
                newState.guild.channels.fetch(result.voiceStateJoin_channel)
                  .then(channel => {
                    // CREO IL MESSAGGIO EMBED DA MANDARE
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: "Alka Hub | Logs System 🔊" })
                      .setDescription(language_result.logs_system.join_now
                        .replace("{1}", newState.member.user)
                        .replace("{2}", newState.channel))
                      .setColor(0x358f38);
                    channel.send({ embeds: [embedLog] });
                  })
                  .catch(console.error);
              }
              // UN UTENTE SI E' DISCONNESSO DAI CANALI VOCALI
              if(oldState.channel?.id && !newState.channel?.id) {
                newState.guild.channels.fetch(result.voiceStateJoin_channel)
                  .then(channel => {
                    // CREO IL MESSAGGIO EMBED DA MANDARE
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: "Alka Hub | Logs System 🔊" })
                      .setDescription(language_result.logs_system.left_now
                        .replace("{1}", oldState.member.user)
                        .replace("{2}", oldState.channel))
                      .setColor(0x7a3131);
                    channel.send({ embeds: [embedLog] });
                  })
                  .catch(console.error);
              }
            });
        } 
      });
    });
  },
};