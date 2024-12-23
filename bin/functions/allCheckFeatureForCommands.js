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
 * @param {object} interaction (L'interazione del comando slash)
 * @param {string} guildId (L'id della gilda)
 * @param {integer} featureId (L'id della feature)
 * @param {string} languageSystemDisabled (Il messaggio di errore se il sistema è disabilitato)
 * @param {string} languagePremiumLimitation (Il messaggio di errore se la limitazione premium è stata raggiunta)
 * @param {string} languagePremiumFeature (Il messaggio di errore se la feature è premium)
 * @param {string} languageFeatureIsEnabled (Il messaggio di errore se la feature è disabilitata)
 * @return {boolean} (Ritorna true, se tutto va bene, false se c'è qualche problema e manda di conseguenza una risposta a un interazione)
 */
async function allCheckFeatureForCommands(interaction, guildId, featureId, languageSystemDisabled, languagePremiumLimitation, languagePremiumFeature, languageFeatureIsEnabled) {
  if (await checkFeaturesIsEnabled(guildId, featureId)) {
    
    const howManyLengthUseForFeature = await getLengthFeature(featureId);
    
    if (await checkPremiumLimitation(guildId, featureId) == -1 || howManyLengthUseForFeature < await checkPremiumLimitation(guildId, featureId)) {
      if (await checkPremiumFeature(guildId, featureId)) {
        if (await checkFeatureSystemDisabled(featureId, featureId)) {
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


/**
 * Questa funzione serve per controllare quante volte una configurazione si ripete nel database, cosi da poterne limitare l'usabilità per i casi non premium.
 * @param {integer} featureId 
 * @returns {integer}
 */
async function getLengthFeature(featureId) {
  let howManyLengthUseForFeature = 0;
    switch(featureId) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        howManyLengthUseForFeature = (await findAllAutoVoice()).length;
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
        break;
      case 11:
        break;
    }
    return howManyLengthUseForFeature;
}


module.exports = {allCheckFeatureForCommands};