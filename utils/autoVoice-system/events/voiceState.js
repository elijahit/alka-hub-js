// Code: utils/autoVoice-system/events/voiceState.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file voiceState.js
 * @module voiceState
 * @description Questo file contiene l'evento per il controllo dello stato vocale degli utenti
 */

const { Events, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { findAutoVoiceByChannelId } = require('../../../bin/service/DatabaseService');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');


// FUNCTION

async function createChannel(oldState, newState) {

  let check = await findAutoVoiceByChannelId(newState.guild.id, newState.channel.parentId);
  check = check?.get({ plain: true }) ?? false;

  if(check) {
    // TIPO NUMERICO
    if (check.type == 2) {
      let channelName = newState.channel.name.split(" ");
      let channelNameResult = "";
      await channelName.forEach(value => {
        let regex = /^[0-9]+$/;
        if (regex.test(value)) {
          channelNameResult = value;
        }
      })
  
      let category = await oldState.guild.channels.fetch(check.channel_id);
      const checkSizeChannel = await category.children.cache;
      let channelAvaiable = 0;
      let channelCount = 0;
      await checkSizeChannel.each(value => {
        if (value.type == 2 && value.parentId == newState.channel.parentId && value.members.size < 1 && value.id != newState.channel.id) {
          channelAvaiable++;
        }
        if (value.type == 2 && value.parentId == newState.channel.parentId) {
          channelCount++;
        }
      })
      if (channelAvaiable == 0) {
        let newChannel = await newState.channel.clone({
          name: newState.channel.name.replace(channelNameResult, `${channelCount + 1}`),
        });
        newChannel.setPosition(channelCount+2); // Imposto la posizione del nuovo canale
      }
    }
  }

}

async function deleteChannel(oldState) {
  let check = await findAutoVoiceByChannelId(oldState.guild.id, oldState.channel.parentId);
  check = check?.get({ plain: true }) ?? false;

  if (check) {
    if (oldState.channel.members.size < 1) {
      let category = await oldState.guild.channels.fetch(check.channel_id);
      const checkSizeChannel = await category.children.cache;
      let sizeChannel = 0;

      await checkSizeChannel.each(value => {
        if (value.type == 2 && value?.parentId == oldState.channel?.parentId) {
          sizeChannel++;
        }
      })
      setTimeout(async () => {

        if (sizeChannel > 1) {


          const checkSizeForDelete = await category.children.cache;
          let checkAnotherSize = 0;

          await checkSizeForDelete.each(value => {
            if (value.type == 2 && value?.parentId == oldState.channel.parentId && value.members.size == 0) {
              checkAnotherSize++;
            }
          })


          if (oldState.channel.members.size < 1 && checkAnotherSize > 1) {


            await oldState.channel.delete();
            const renameChannel = await category.children.cache;
            let channelCount = 0;
            await renameChannel.each(async value => {
              if (value.type == 2 && value?.parentId == check.channel_id) {
                let regex = /^[0-9]+$/;
                let name = value.name.split(" ");
                let nameResult = "";
                await name.forEach(valueName => {
                  if (regex.test(valueName)) {
                    nameResult = valueName;
                  }
                });


                channelCount++;
                await value.edit({ name: value.name.replace(nameResult, `${channelCount}`) });
              }
            });
          }
        }
      }, 3000); //DA MODIFICARE
    }
  }
}


module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    if(!await checkFeatureSystemDisabled(3)) return;
    if(!await checkFeaturesIsEnabled(newState.guild.id, 3)) return;
    if(!await checkPremiumFeature(newState.guild.id, 3)) return;

    try {
      // CONTROLLO DELLA LINGUA
      if (oldState.guild?.id) {
        let data = await language.databaseCheck(oldState.guild.id);
        const langagues_path = readFileSync(`./languages/autoVoice-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        // UN UTENTE SI E' SPOSTATO DA UN CANALE A UN ALTRO
        if (oldState.channel?.id && newState.channel?.id && oldState.channel?.id != newState.channel?.id) {
          await deleteChannel(oldState);
          await createChannel(oldState, newState);
        }

        // UN UTENTE HA EFFETTUATO L'ACCESSO IN UN NUOVO CANALE
        if (!oldState.channel?.id && newState.channel?.id) {
          await createChannel(oldState, newState);
        }

        // UN UTENTE SI E' DISCONNESSO DAI CANALI VOCALI
        if (oldState.channel?.id && !newState.channel?.id) {
          await deleteChannel(oldState);
        }

      }
    }
    catch (error) {
      errorSendControls(error, oldState.client, oldState.guild, "\\autoVoice-system\\voiceState.js");
    }
  },
};