// Code: utils/logs-system/events/InviteCreate.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file InviteCreate.js
 * @module InviteCreate
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
  name: Events.InviteCreate,
  async execute(invite, variables) {
    let customEmoji = emoji.logsSystem.newInviteMarker;

    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(invite.guild.id, 1, variables)) return;
    if (!await checkPremiumFeature(invite.guild.id, 1, variables)) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (invite.guild?.id) {
        let data = await language.databaseCheck(invite.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(invite.guild.id, variables);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["invite_state_channel"]) return;

        let channel_logs = await invite.guild.channels.fetch(resultDb["invite_state_channel"]);
        const fields = [];
        const embedLog = new EmbedBuilder();

        const date = new Date(invite.expiresTimestamp);
        let dateFinal, dateFinalH, maxUse;

        if (Date.parse(date) == 0) {
          dateFinal = language_result.inviteCreate.no_expiry;
          dateFinalH = " ";
        } else {
          dateFinal = language_result.inviteCreate.date_format
            .replace("{1}", `${date.getDate()}`)
            .replace("{2}", `${date.getMonth() + 1}`)
            .replace("{3}", `${date.getFullYear()}`);
          dateFinalH = `| ${date.getHours()}:${date.getMinutes()}`;
        }

        if (invite.maxUses == 0) {
          maxUse = language_result.inviteCreate.use_no_expiry;
        } else {
          maxUse = invite.maxUses;
        }

        fields.push(
          { name: `${language_result.inviteCreate.channel_invite}`, value: `${invite.channel}`, inline: true },
          { name: `${language_result.inviteCreate.invite_code}`, value: `${invite.code}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.inviteCreate.embed_expiry}`, value: `${dateFinal} ${dateFinalH}`, inline: true },
          { name: `${language_result.inviteCreate.embed_inviter}`, value: `${invite.inviter}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.inviteCreate.embed_use}`, value: `${maxUse}`, inline: true },
          { name: `${language_result.inviteCreate.embed_url}`, value: `${invite.url}`, inline: true }

        );


        embedLog
          .setAuthor({ name: `${language_result.inviteCreate.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setDescription(language_result.inviteCreate.embed_description)
          .setColor(colors.general.success);
        channel_logs.send({ embeds: [embedLog] })
      }
    }
    catch (error) {
      errorSendControls(error, invite.client, invite.guild, "\\logs_system\\InviteCreate.js", variables);
    }
  },
};