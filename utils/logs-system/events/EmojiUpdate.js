// Code: utils/logs-system/events/EmojiUpdate.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file EmojiUpdate.js
 * @module EmojiUpdate
 * @description Questo file contiene l'evento per il sistema di Logs
 */

const { Events, EmbedBuilder, TextChannel } = require('discord.js');
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
  name: Events.GuildEmojiUpdate,
  async execute(oldEmoji, newEmoji) {
    let customEmoji = emoji.general.updateMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(oldEmoji.guild.id, 1)) return;
    if (!await checkPremiumFeature(oldEmoji.guild.id, 1)) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (oldEmoji.guild?.id) {
        let data = await language.databaseCheck(oldEmoji.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(oldEmoji.guild.id);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["emoji_state_channel"]) return;
        
        let channel_logs = await oldEmoji.guild.channels.fetch(resultDb["emoji_state_channel"]);
        const fields = [];

        // CONTROLLO EMOJI ANIMATA O NO
        let animatedEmoji, avaliableEmoji;
        switch (oldEmoji.animated) {
          case true:
            animatedEmoji = language_result.emojiUpdate.emoji_animated;
            break;
          case false:
            animatedEmoji = language_result.emojiUpdate.emoji_not_animated;
        }

        // CONTROLLO EMOJI DISPONIBILE O NO
        switch (oldEmoji.available) {
          case true:
            avaliableEmoji = language_result.emojiUpdate.emoji_avaliable;
            break;
          case false:
            avaliableEmoji = language_result.emojiUpdate.emoji_not_avaliable;
        }

        fields.push(
          { name: `${language_result.emojiUpdate.emoji_name_old}`, value: `${oldEmoji.name}`, inline: true },
          { name: `${language_result.emojiUpdate.emoji_name_new}`, value: `${newEmoji.name}`, inline: true },
          { name: `${language_result.emojiUpdate.emoji_id}`, value: `${oldEmoji.id}`, inline: false },
          { name: ` `, value: ` ` },
          { name: `${language_result.emojiUpdate.emoji_state}`, value: `${animatedEmoji}`, inline: true },
          { name: `${language_result.emojiUpdate.emoji_state_avaliable}`, value: `${avaliableEmoji}`, inline: true }
        );

        const emoji = await oldEmoji.guild.emojis.fetch(oldEmoji.id)
        fields.push({ name: " ", value: `${language_result.emojiUpdate.emoji_rappresentative}: ${emoji}` });

        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.emojiUpdate.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
          .setDescription(language_result.emojiUpdate.emoji_update)
          .setColor(colors.general.aquamarine);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      console.log(error)
      errorSendControls(error, oldEmoji.client, oldEmoji.guild, "\\logs_system\\EmojiUpdate.js");
    }
  },
};