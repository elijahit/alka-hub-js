// Code: utils/reactionRole-system/events/reactionRoleAdd.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file reactionRoleAdd.js
 * @module reactionRoleAdd
 * @description Questo file gestisce l'evento per l'aggiunta di un ruolo reazione!
 */

const { Events, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { errorSendControls } = require('../../../bin/HandlingFunctions');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const { findByGuildIdAndMessageIdAndEmojiReactions, findByGuildIdTranslate } = require('../../../bin/service/DatabaseService');
const emojis = require('../../../bin/data/emoji');
const color = require('../../../bin/data/colors');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(messageReaction, user, burst, variables) {
    if (!user.bot || !messageReaction.message.guild || !messageReaction.message.user.bot) {
      const message = messageReaction.message;
      const emoji = messageReaction.emoji;
      const guild = message.guild;
      const member = await guild.members.fetch(user.id);

      if (messageReaction.message.content === "" || messageReaction.message.content === null) return;
      // CONTROLLO SE LA FUNZIONE E' ABILITATA
      let checkTranslateSetting = await findByGuildIdTranslate(guild.id, variables)
      checkTranslateSetting = checkTranslateSetting?.get({ plain: true });
      if (!checkTranslateSetting) return;
      if (!await checkFeatureSystemDisabled(12)) return;
      if (!await checkFeaturesIsEnabled(messageReaction.message.guild.id, 12, variables)) return;
      if (!await checkPremiumFeature(messageReaction.message.guild.id, 12, variables)) return;

      const flagEmojis = [
        { emoji: '🇦🇱', code: 'sq' }, // Albania
        { emoji: '🇷🇴', code: 'ro' }, // Romania
        { emoji: '🇮🇹', code: 'it' }, // Italy
        { emoji: '🇺🇸', code: 'us' }, // United States
        { emoji: '🇬🇧', code: 'gb' }, // United Kingdom
        { emoji: '🇨🇦', code: 'ca' }, // Canada
        { emoji: '🇫🇷', code: 'fr' }, // France
        { emoji: '🇩🇪', code: 'de' }, // Germany
        { emoji: '🇪🇸', code: 'es' }, // Spain
        { emoji: '🇯🇵', code: 'jp' }, // Japan
        { emoji: '🇨🇳', code: 'cn' }, // China
        { emoji: '🇰🇷', code: 'kr' }, // South Korea
        { emoji: '🇧🇷', code: 'br' }, // Brazil
        { emoji: '🇮🇳', code: 'in' }, // India
        { emoji: '🇷🇺', code: 'ru' }, // Russia
        { emoji: '🇦🇺', code: 'au' }, // Australia
        { emoji: '🇲🇽', code: 'mx' }, // Mexico
        { emoji: '🇳🇱', code: 'nl' }, // Netherlands
        { emoji: '🇸🇪', code: 'se' }, // Sweden
        { emoji: '🇳🇴', code: 'no' }, // Norway
        { emoji: '🇩🇰', code: 'dk' }, // Denmark
        { emoji: '🇫🇮', code: 'fi' }, // Finland
        { emoji: '🇨🇭', code: 'ch' }, // Switzerland
        { emoji: '🇧🇪', code: 'be' }, // Belgium
        { emoji: '🇦🇹', code: 'at' }, // Austria
        { emoji: '🇵🇹', code: 'pt' }, // Portugal
        { emoji: '🇬🇷', code: 'gr' }, // Greece
        { emoji: '🇹🇷', code: 'tr' }, // Turkey
        { emoji: '🇸🇦', code: 'sa' }, // Saudi Arabia
        { emoji: '🇿🇦', code: 'za' }, // South Africa
        { emoji: '🇦🇷', code: 'ar' }, // Argentina
        { emoji: '🇨🇱', code: 'cl' }, // Chile
        { emoji: '🇨🇴', code: 'co' }, // Colombia
        { emoji: '🇵🇪', code: 'pe' }, // Peru
        { emoji: '🇻🇪', code: 've' }, // Venezuela
        { emoji: '🇪🇬', code: 'eg' }, // Egypt
        { emoji: '🇳🇬', code: 'ng' }, // Nigeria
        { emoji: '🇰🇪', code: 'ke' }, // Kenya
        { emoji: '🇮🇱', code: 'il' }, // Israel
        { emoji: '🇦🇪', code: 'ae' }, // United Arab Emirates
        { emoji: '🇸🇬', code: 'sg' }, // Singapore
        { emoji: '🇲🇾', code: 'my' }, // Malaysia
        { emoji: '🇮🇩', code: 'id' }, // Indonesia
        { emoji: '🇹🇭', code: 'th' }, // Thailand
        { emoji: '🇻🇳', code: 'vn' }, // Vietnam
        { emoji: '🇵🇭', code: 'ph' }, // Philippines
        { emoji: '🇳🇿', code: 'nz' }, // New Zealand
        { emoji: '🇵🇰', code: 'pk' }, // Pakistan
        { emoji: '🇧🇩', code: 'bd' }, // Bangladesh
        { emoji: '🇱🇰', code: 'lk' }, // Sri Lanka
        { emoji: '🇳🇵', code: 'np' }, // Nepal
        { emoji: '🇧🇹', code: 'bt' }, // Bhutan
        { emoji: '🇲🇻', code: 'mv' }, // Maldives
        { emoji: '🇦🇫', code: 'af' }, // Afghanistan
        { emoji: '🇮🇶', code: 'iq' }, // Iraq
        { emoji: '🇮🇷', code: 'ir' }, // Iran
        { emoji: '🇸🇾', code: 'sy' }, // Syria
        { emoji: '🇱🇧', code: 'lb' }, // Lebanon
        { emoji: '🇯🇴', code: 'jo' }, // Jordan
        { emoji: '🇰🇼', code: 'kw' }, // Kuwait
        { emoji: '🇶🇦', code: 'qa' }, // Qatar
        { emoji: '🇧🇭', code: 'bh' }, // Bahrain
        { emoji: '🇴🇲', code: 'om' }, // Oman
        { emoji: '🇾🇪', code: 'ye' }, // Yemen
        { emoji: '🇲🇦', code: 'ma' }, // Morocco
        { emoji: '🇩🇿', code: 'dz' }, // Algeria
        { emoji: '🇹🇳', code: 'tn' }, // Tunisia
        { emoji: '🇱🇾', code: 'ly' }, // Libya
        { emoji: '🇸🇩', code: 'sd' }, // Sudan
        { emoji: '🇪🇹', code: 'et' }, // Ethiopia
        { emoji: '🇸🇴', code: 'so' }, // Somalia
        { emoji: '🇺🇬', code: 'ug' }, // Uganda
        { emoji: '🇹🇿', code: 'tz' }, // Tanzania
        { emoji: '🇿🇲', code: 'zm' }, // Zambia
        { emoji: '🇿🇼', code: 'zw' }, // Zimbabwe
        { emoji: '🇧🇼', code: 'bw' }, // Botswana
        { emoji: '🇳🇦', code: 'na' }, // Namibia
        { emoji: '🇲🇿', code: 'mz' }, // Mozambique
        { emoji: '🇦🇴', code: 'ao' }, // Angola
        { emoji: '🇬🇭', code: 'gh' }, // Ghana
        { emoji: '🇨🇮', code: 'ci' }, // Ivory Coast
        { emoji: '🇸🇳', code: 'sn' }, // Senegal
        { emoji: '🇲🇱', code: 'ml' }, // Mali
        { emoji: '🇧🇫', code: 'bf' }, // Burkina Faso
        { emoji: '🇳🇪', code: 'ne' }, // Niger
        { emoji: '🇹🇩', code: 'td' }, // Chad
        { emoji: '🇲🇷', code: 'mr' }, // Mauritania
        { emoji: '🇲🇬', code: 'mg' }, // Madagascar
        { emoji: '🇸🇨', code: 'sc' }, // Seychelles
        { emoji: '🇲🇺', code: 'mu' }, // Mauritius
        { emoji: '🇰🇲', code: 'km' }, // Comoros
        { emoji: '🇨🇻', code: 'cv' }, // Cape Verde
        { emoji: '🇸🇹', code: 'st' }, // Sao Tome and Principe
        { emoji: '🇬🇶', code: 'gq' }, // Equatorial Guinea
        { emoji: '🇬🇦', code: 'ga' }, // Gabon
        { emoji: '🇨🇬', code: 'cg' }, // Republic of the Congo
        { emoji: '🇨🇩', code: 'cd' }, // Democratic Republic of the Congo
        { emoji: '🇨🇫', code: 'cf' }, // Central African Republic
        { emoji: '🇨🇲', code: 'cm' }, // Cameroon
        { emoji: '🇧🇮', code: 'bi' }, // Burundi
        { emoji: '🇷🇼', code: 'rw' }, // Rwanda
        { emoji: '🇸🇸', code: 'ss' }, // South Sudan
        { emoji: '🇪🇷', code: 'er' }, // Eritrea
        { emoji: '🇩🇯', code: 'dj' }, // Djibouti
        { emoji: '🇸🇴', code: 'so' }, // Somaliland
        { emoji: '🇪🇭', code: 'eh' }, // Western Sahara
        { emoji: '🇦🇲', code: 'am' }, // Armenia
        { emoji: '🇦🇿', code: 'az' }, // Azerbaijan
        { emoji: '🇧🇾', code: 'by' }, // Belarus
        { emoji: '🇧🇬', code: 'bg' }, // Bulgaria
        { emoji: '🇭🇷', code: 'hr' }, // Croatia
        { emoji: '🇨🇾', code: 'cy' }, // Cyprus
        { emoji: '🇨🇿', code: 'cz' }, // Czech Republic
        { emoji: '🇪🇪', code: 'ee' }, // Estonia
        { emoji: '🇬🇪', code: 'ge' }, // Georgia
        { emoji: '🇭🇺', code: 'hu' }, // Hungary
        { emoji: '🇮🇸', code: 'is' }, // Iceland
        { emoji: '🇽🇰', code: 'xk' }, // Kosovo
        { emoji: '🇱🇻', code: 'lv' }, // Latvia
        { emoji: '🇱🇹', code: 'lt' }, // Lithuania
        { emoji: '🇲🇩', code: 'md' }, // Moldova
        { emoji: '🇲🇪', code: 'me' }, // Montenegro
        { emoji: '🇲🇰', code: 'mk' }, // North Macedonia
        { emoji: '🇵🇱', code: 'pl' }, // Poland
        { emoji: '🇷🇸', code: 'rs' }, // Serbia
        { emoji: '🇸🇰', code: 'sk' }, // Slovakia
        { emoji: '🇸🇮', code: 'si' }, // Slovenia
        { emoji: '🇺🇦', code: 'ua' }, // Ukraine
        { emoji: '🇻🇦', code: 'va' }, // Vatican City
        { emoji: '🇵🇸', code: 'ps' }, // Palestine
      ];
      const found = flagEmojis.find(flag => flag.emoji === emoji.name);
      if (!found) return;
      try {

        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${found.code}&dt=t&q=${messageReaction.message.content}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const json = await res.json();
        let translatedText = "";
        json[0].forEach((element) => {
          translatedText += element[0] + " "; 
        });
        const embedLog = new EmbedBuilder()
          .setDescription(`## Translate System\n` + `${translatedText}`)
          .setColor(color.general.blue)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` });
        if(checkTranslateSetting.mode == 0) await messageReaction.message.reply({ embeds: [embedLog] });
        if(checkTranslateSetting.mode == 1) await messageReaction.message.reply({ embeds: [embedLog], ephemeral: true });
        await messageReaction.remove();


      }
      catch (error) {
        errorSendControls(error, member.client, guild, "\\translate-system\\reactionRoleAdd.js", variables);
      }
    }
  },
};