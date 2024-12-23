// Code: utils/logs-system/events/MessageReactionRemoveAll.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file MessageReactionRemoveAll.js
 * @module MessageReactionRemoveAll
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
  name: Events.MessageReactionRemoveAll,
  async execute(message, reactions) {
    console.log(message.guild.id)
    let customEmoji = emoji.general.deleteMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(message.guild.id, 1)) return;
    if (!await checkPremiumFeature(message.guild.id, 1)) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (message.guild?.id) {
        let data = await language.databaseCheck(message.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(message.guild.id);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["message_state_channel"]) return;

        let channel_logs = await message.guild.channels.fetch(resultDb["message_state_channel"]);
        const fields = [];

        fields.push(
          { name: `${language_result.messageReactionRemoveAll.message_channel}`, value: `${message.channel}`, inline: true },
          { name: `${language_result.messageReactionRemoveAll.message_channel_id}`, value: `${message.channel.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.messageReactionRemoveAll.message_embed}`, value: `${message.url}`, inline: true },
          { name: `${language_result.messageReactionRemoveAll.message_embed_id}`, value: `${message.id}`, inline: true }
        );
        let reactionsContainer = "";
        await reactions.each(reaction => {
          reactionsContainer += `> ${reaction._emoji} (${reaction.count})\n`;
        })
        if(reactionsContainer == "") reactionsContainer = "Undefined";

        fields.push({ name: `${language_result.messageReactionRemoveAll.embed_reactions}`, value: `${reactionsContainer}` });

        const embedLog = new EmbedBuilder();
        embedLog
          .setAuthor({ name: `${language_result.messageReactionRemoveAll.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setDescription(language_result.messageReactionRemoveAll.embed_description)
          .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
          .setColor(colors.general.error);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, message.client, message.guild, "\\logs_system\\MessageReactionRemoveAll.js");
    }
  },
};