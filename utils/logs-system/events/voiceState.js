const { Events, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { findLogsByGuildId } = require('../../../bin/service/DatabaseService');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const Variables = require('../../../bin/classes/GlobalVariables');

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    let customEmoji = emoji.general.voiceMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(oldState.guild.id, 1)) return;
    if (!await checkPremiumFeature(oldState.guild.id, 1)) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (oldState.guild?.id) {
        let data = await language.databaseCheck(oldState.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(oldState.guild.id);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["voice_state_channel"]) return;

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
            .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
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
            .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
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
            .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
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