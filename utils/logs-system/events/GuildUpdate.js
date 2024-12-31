// Code: utils/logs-system/events/GuildUpdate.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file GuildUpdate.js
 * @module GuildUpdate
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
  name: Events.GuildUpdate,
  async execute(oldGuild, newGuild, variables) {
    let customEmoji = emoji.logsSystem.guildUpdateMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(oldGuild.id, 1, variables)) return;
    if (!await checkPremiumFeature(oldGuild.id, 1, variables)) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (oldGuild?.id) {
        let data = await language.databaseCheck(oldGuild.id, variables);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(oldGuild.id, variables);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["guild_state_channel"]) return;

        let channel_logs = await oldGuild.channels.fetch(resultDb["guild_state_channel"]);
        const fields = [];
        const embedLog = new EmbedBuilder();
        let changeCheck = false;
        // SE IL NOME CAMBIA
        if (oldGuild.name != newGuild.name) {
          changeCheck = true;
          fields.push(
            { name: " ", value: `${language_result.guildUpdate.embed_name}` },
            { name: `${language_result.guildUpdate.old_name}`, value: `${oldGuild.name}`, inline: true },
            { name: `${language_result.guildUpdate.new_name}`, value: `${newGuild.name}`, inline: true }
          );
        }

        // SE IL CANALE AFK VIENE CAMBIATO
        if (oldGuild.afkChannel != newGuild.afkChannel) {
          changeCheck = true;
          let afkChannelOld, afkChannelNew;
          if (!oldGuild.afkChannel) {
            afkChannelOld = language_result.guildUpdate.embed_empty;
          } else {
            afkChannelOld = oldGuild.afkChannel;
          }
          if (!newGuild.afkChannel) {
            afkChannelNew = language_result.guildUpdate.embed_empty;
          } else {
            afkChannelNew = newGuild.afkChannel;
          }
          fields.push(
            { name: " ", value: `${language_result.guildUpdate.embed_afkchannel}` },
            { name: `${language_result.guildUpdate.old_afkchannel}`, value: `${afkChannelOld}`, inline: true },
            { name: `${language_result.guildUpdate.new_afkchannel}`, value: `${afkChannelNew}`, inline: true }
          );
        }

        // SE IL TEMPO LIMITE PER AFK CAMBIA
        if (oldGuild.afkTimeout != newGuild.afkTimeout) {
          changeCheck = true;
          fields.push(
            { name: " ", value: `${language_result.guildUpdate.embed_timeout}` },
            { name: `${language_result.guildUpdate.old_timeout}`, value: `${oldGuild.afkTimeout}`, inline: true },
            { name: `${language_result.guildUpdate.new_timeout}`, value: `${newGuild.afkTimeout}`, inline: true }
          );
        }

        // SE IL LOGO VIENE CAMBIATO
        if (oldGuild.icon != newGuild.icon) {
          changeCheck = true;
          fields.push(
            { name: " ", value: `${language_result.guildUpdate.embed_icon}` });
          if (newGuild.icon) {
            embedLog.setThumbnail(`https://cdn.discordapp.com/icons/${newGuild.id}/${newGuild.icon}.png`)
          }
        }

        // SE LA DESCRIZIONE VIENE CAMBIATA
        if (oldGuild.description != newGuild.description) {
          changeCheck = true;
          let oldDescription, newDescription;

          if (oldGuild.description) {
            oldDescription = oldGuild.description;
          } else {
            oldDescription = language_result.guildUpdate.embed_empty;
          }

          if (newGuild.description) {
            newDescription = newGuild.description;
          } else {
            newDescription = language_result.guildUpdate.embed_empty;
          }


          fields.push(
            { name: " ", value: `${language_result.guildUpdate.embed_description}` },
            { name: `${language_result.guildUpdate.old_desc}`, value: `${oldDescription}`, inline: true },
            { name: `${language_result.guildUpdate.new_desc}`, value: `${newDescription}`, inline: true }
          );
        }

        // SE IL PROPRIETARIO VIENE CAMBIATO
        if (oldGuild.ownerId != newGuild.ownerId) {
          changeCheck = true;
          fields.push(
            { name: ` `, value: ` ` }
          );
          let oldMember = await oldGuild.members.fetch(oldGuild.ownerId)
          fields.push(
            { name: `${language_result.guildUpdate.old_owner}`, value: `${oldMember}`, inline: true }
          );
          let newMember = await newGuild.members.fetch(newGuild.ownerId)
          fields.push(
            { name: `${language_result.guildUpdate.new_owner}`, value: `${newMember}`, inline: true }
          );
        }


        if (!changeCheck) return;
        embedLog
          .setAuthor({ name: `${language_result.guildUpdate.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setColor(colors.general.blue);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, oldGuild.client, oldGuild, "\\logs_system\\GuildUpdate.js", variables);
    }
  },
};