const { Events, EmbedBuilder, Embed } = require('discord.js');
const { readFileSync } = require('fs');
const database = require('../../../bin/database');
const language = require('../../../languages/languages');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT voiceStateJoin_channel FROM log_system_config WHERE guildId = ?`;
// ----------------

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
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
                    .setAuthor({ name: "Alka Hub | Logs System 🎵" })
                    .addFields(
                      {name: "Vecchio Canale", value: `${oldState.channel}`, inline: true},
                      {name: "Nuovo Canale", value: `${newState.channel}`, inline: true})
                    .setDescription(language_result.logs_system.move_to.replace("{1}", oldState.member.user))
                    .setColor(153, 204, 255);
                  channel.send({ embeds: [embedLog] });
                })
                .catch(console.error);
            }
          });
      } else {
        language.databaseCheck(newState.guild.id)
          .then(data => {
            //
          });
      }
    });
  },
};