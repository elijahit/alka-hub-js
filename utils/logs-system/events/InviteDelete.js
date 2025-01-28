// Code: utils/logs-system/events/InviteDelete.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file InviteDelete.js
 * @module InviteDelete
 * @description Questo file contiene l'evento per il sistema di Logs
 */

const { Events, EmbedBuilder, TextChannel, Colors } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmoji, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { findLogsByGuildId } = require('../../../bin/service/DatabaseService');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const Variables = require('../../../bin/classes/GlobalVariables');

module.exports = {
  name: Events.InviteDelete,
  async execute(invite, variables) {
    let customEmoji = emoji.general.deleteMarker;

    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(invite.guild.id, 1, variables)) return;
    if (!await checkPremiumFeature(invite.guild.id, 1, variables)) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (invite.guild?.id) {
        const data = await language.databaseCheck(invite.guild.id, variables);

        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(invite.guild.id, variables);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["invite_state_channel"]) return;

        const channel_logs = await invite.guild.channels.fetch(resultDb["invite_state_channel"]);
        const fields = [];
        const embedLog = new EmbedBuilder();

        fields.push(
          { name: `${language_result.inviteDelete.channel_invite}`, value: `${invite.channel}`, inline: true },
          { name: `${language_result.inviteDelete.invite_code}`, value: `${invite.code}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.inviteDelete.embed_url}`, value: `${invite.url}`, inline: true }

        );

        embedLog
          .addFields(fields)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setDescription(`## ${language_result.inviteDelete.embed_title}\n` + language_result.inviteDelete.embed_description)
          .setThumbnail(variables.getBotFooterIcon())
          .setColor(colors.general.error);
        channel_logs.send({ embeds: [embedLog] })
      }
    }
    catch (error) {
      errorSendControls(error, invite.client, invite.guild, "\\logs_system\\InviteDelete.js", variables);
    }

  },
};