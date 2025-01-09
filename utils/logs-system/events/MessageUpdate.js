// Code: utils/logs-system/events/MessageUpdate.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file MessageUpdate.js
 * @module MessageUpdate
 * @description Questo file contiene l'evento per il sistema di Logs
 */

const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync, read } = require('fs');
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
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage, variables) {
    let customEmoji = emoji.general.updateMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(oldMessage.guild.id, 1, variables)) return;
    if (!await checkPremiumFeature(oldMessage.guild.id, 1, variables)) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      if(oldMessage.author.id == oldMessage.client.user.id) return;
      // CONTROLLO DELLA LINGUA
      if (oldMessage.guild?.id) {
        let data = await language.databaseCheck(oldMessage.guild.id, variables);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(oldMessage.guild.id, variables);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["message_state_channel"]) return;

        let channel_logs = await oldMessage.guild.channels.fetch(resultDb["message_state_channel"]);
        const fields = [];

        fields.push(
          { name: `${language_result.messageUpdate.channel_message}`, value: `${oldMessage.channel}`, inline: true },
          { name: `${language_result.messageUpdate.channel_message_id}`, value: `${oldMessage.channelId}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.messageUpdate.author_message}`, value: `${oldMessage.author}`, inline: true },
          { name: `${language_result.messageUpdate.author_message_id}`, value: `${oldMessage.author.id}`, inline: true },
          { name: " ", value: " " }
        );

        const embedLog = new EmbedBuilder();
        if (oldMessage.content && !newMessage.content) {
          embedLog
            .setDescription(`## ${language_result.messageUpdate.embed_title}\n` + `**${language_result.messageUpdate.embed_description}:**\n${oldMessage.content}`);
        } else if (!oldMessage.content && newMessage.content) {
          embedLog
            .setDescription(`## ${language_result.messageUpdate.embed_title}\n` + `**${language_result.messageUpdate.embed_description_new}:**\n${newMessage.content}`);
        } else if (oldMessage.content && newMessage.content) {
          embedLog
            .setDescription(`## ${language_result.messageUpdate.embed_title}\n` + `**${language_result.messageUpdate.embed_description}:**\n${oldMessage.content}\n**${language_result.messageUpdate.embed_description_new}:**\n${newMessage.content}`);
        }

        if (oldMessage.attachments.size > 0) {
          let attachmentsContainer = "";
          await oldMessage.attachments.each(value => {
            attachmentsContainer += `${value.url}\n`;
          });
          fields.push({ name: `${language_result.messageUpdate.attachments_message}`, value: `${attachmentsContainer}` });
        }
        fields.push({ name: `${language_result.messageUpdate.go_message}`, value: `${oldMessage.url}` })

        embedLog
          .addFields(fields)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setThumbnail(variables.getBotFooterIcon())
          .setColor(colors.general.danger);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, oldMessage.client, oldMessage.guild, "\\logs_system\\MessageUpdate.js", variables);
    }
  },
};