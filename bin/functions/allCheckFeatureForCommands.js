const { EmbedBuilder } = require('discord.js');
const { checkPremiumLimitation, checkPremiumFeature } = require('../../bin/functions/checkPremiumFeature');
const { findAllAutoVoice } = require('../../bin/service/DatabaseService');
const { checkFeatureSystemDisabled } = require('../../bin/functions/checkFeatureSystemDisabled');
const checkFeaturesIsEnabled = require('../../bin/functions/checkFeaturesIsEnabled');
const { noEnabledFunc } = require('../HandlingFunctions');
const emoji = require('../data/emoji');
const colors = require('../data/colors');
const Variables = require('../classes/GlobalVariables');


/**
 * Questa funzione dev'essere utilizzata solo in un comando che utilizza la tecnologia slashCommands.
 * la funzione serve per fare tutti i check su una feature di Alka Hub.
 * 
 * @param {*} guildId (L'id del server)
 * @param {*} featureId (L'id della feature)
 * @param {*} languageSystemDisabled (La scritta che deve apparire quando una funzione è disabilitata da sistema)
 * @param {*} languagePremiumLimitation (La scritta che deve apparire quando una funzione è limitata)
 * @param {*} languagePremiumFeature (La scritta che deve apparire quando una funzione è premium)
 * @param {*} languageFeatureIsEnabled (La scritta che deve apparire quando una funzionalità è disabilitata da utente)
 * @return {boolean} (Ritorna true, se tutto va bene, false se c'è qualche problema e manda di conseguenza una risposta a un interazione)
 */
async function allCheckFeatureForCommands(interaction, guildId, featureId, languageSystemDisabled, languagePremiumLimitation, languagePremiumFeature, languageFeatureIsEnabled) {
  if (await checkFeaturesIsEnabled(guildId, featureId)) {
    if (await checkPremiumLimitation(guildId, featureId) == -1 || (await findAllAutoVoice()).length < await checkPremiumLimitation(guildId, featureId)) {
      if (await checkPremiumFeature(guildId, featureId)) {
        if (await checkFeatureSystemDisabled(guildId, featureId)) {
          return true;
        }
        else {
          let customEmoji = emoji.general.errorMarker;
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${Variables.getBotName()} | Feature Controls`, iconURL: customEmoji })
            .setDescription(languageSystemDisabled)
            .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
            .setColor(colors.general.error);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
          return false;
        }
      }
      else {
        let customEmoji = emoji.general.errorMarker;
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${Variables.getBotName()} | Feature Controls`, iconURL: customEmoji })
          .setDescription(languagePremiumFeature)
          .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
          .setColor(colors.general.error);
        await interaction.reply({ embeds: [embedLog], ephemeral: true });
        return false;
      }
    }
    else {
      let customEmoji = emoji.general.errorMarker;
      const embedLog = new EmbedBuilder()
        .setAuthor({ name: `${Variables.getBotName()} | Feature Controls`, iconURL: customEmoji })
        .setDescription(languagePremiumLimitation)
        .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
        .setColor(colors.general.error);
      await interaction.reply({ embeds: [embedLog], ephemeral: true });
      return false;
    }

  } else {
    await noEnabledFunc(interaction, languageFeatureIsEnabled);  
    return false;
  }
}


module.exports = {allCheckFeatureForCommands};