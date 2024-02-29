const { Events, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb, readDbAllWith2Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlEnabledFeature = `SELECT autoVoiceSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ----------------

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const result_Db = await readDb(sqlEnabledFeature, newState.guild.id);
    if (!result_Db) return;
    if (result_Db.autoVoiceSystem_enabled != 1) return;
    try {
      // CONTROLLO DELLA LINGUA
      if (oldState.guild?.id) {
        let data = await language.databaseCheck(oldState.guild.id);
        const langagues_path = readFileSync(`./languages/autoVoice-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        // UN UTENTE SI E' SPOSTATO DA UN CANALE A UN ALTRO
        if (oldState.channel?.id && newState.channel?.id && oldState.channel?.id != newState.channel?.id) {
          
        }

        // UN UTENTE HA EFFETTUATO L'ACCESSO IN UN NUOVO CANALE
        if (!oldState.channel?.id && newState.channel?.id) {
          const check = await readDbAllWith2Params(`SELECT * FROM autovoice_system_creator WHERE guildId = ? AND categoryId = ?`, newState.guild.id, newState.channel.parentId);
          // TIPO NUMERICO
          if(check[0].typeVoice == 2) {
            let channelName = newState.channel.name.split(" ");
            let channelNameResult = "";
            await channelName.forEach(value => {
              let regex = /^[0-9]+$/;
              if(regex.test(value)) {
                channelNameResult = value;
              }
            })
            newState.channel.clone({
              name: newState.channel.name.replace(channelNameResult, `${+channelNameResult + 1}`),
            })
          }

        }

        // UN UTENTE SI E' DISCONNESSO DAI CANALI VOCALI
        if (oldState.channel?.id && !newState.channel?.id) {
          

        }
      }
    }
    catch (error) {
      errorSendControls(error, oldState.client, oldState.guild, "\\autoVoice-system\\VoiceState.js");
    }
  },
};