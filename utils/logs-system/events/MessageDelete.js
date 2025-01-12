// Code: utils/logs-system/events/MessageDelete.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file MessageDelete.js
 * @module MessageDelete
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
  name: Events.MessageDelete,
  async execute(message, variables) {
    let customEmoji = emoji.general.deleteMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(message.guild.id, 1, variables)) return;
    if (!await checkPremiumFeature(message.guild.id, 1, variables)) return;
    try {
      // CONTROLLO DELLA LINGUA
      if (message.guild?.id) {
        let data = await language.databaseCheck(message.guild.id, variables);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(message.guild.id, variables);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["message_state_channel"]) return;

        let channel_logs = await message.guild.channels.fetch(resultDb["message_state_channel"]);
        const fields = [];
        fields.push(
          { name: `${language_result.messageDelete.channel_message}`, value: `${message.channel}`, inline: true },
          { name: `${language_result.messageDelete.channel_message_id}`, value: `${message.channelId}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.messageDelete.author_message}`, value: `${message.author ?? "Undefined"}`, inline: true },
          { name: `${language_result.messageDelete.author_message_id}`, value: `${message.author?.id ?? "Undefined"}`, inline: true },
          { name: " ", value: " " }
        );

        const embedLog = new EmbedBuilder();
        if (message.content) {
          embedLog
            .setDescription(`## ${language_result.messageDelete.embed_title}\n` + `**${language_result.messageDelete.embed_description}:**\n${message.content}`);
        }

        if (message.attachments.size > 0) {
          let attachmentsContainer = "";
          await message.attachments.each(value => {
            attachmentsContainer += `${value.url}\n`;
          });
          fields.push({ name: `${language_result.messageDelete.attachments_message}`, value: `${attachmentsContainer}` });
        }
        embedLog
          .addFields(fields)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setThumbnail(variables.getBotFooterIcon())
          .setColor(colors.general.error);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, message.client, message.guild, "\\logs_system\\MessageDelete.js", variables);
    }
  },
};