// Code: utils/logs-system/events/GuildBanRemove.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file GuildBanRemove.js
 * @module GuildBanRemove
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
  name: Events.GuildBanRemove,
  async execute(ban, variables) {
    let customEmoji = emoji.logsSystem.unBanMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(ban.guild.id, 1, variables)) return;
    if (!await checkPremiumFeature(ban.guild.id, 1, variables)) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (ban.guild?.id) {
        let data = await language.databaseCheck(ban.guild.id, variables);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(ban.guild.id, variables);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["ban_state_channel"]) return;

        let channel_logs = await ban.guild.channels.fetch(resultDb["ban_state_channel"]);
        const fields = [];
        fields.push(
          { name: `${language_result.guildBanRemove.ban_user}`, value: `${ban.user}`, inline: true },
          { name: `${language_result.guildBanRemove.ban_user_id}`, value: `${ban.user.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.guildBanRemove.ban_username}`, value: `${ban.user.username}`, inline: true }
        );

        if (ban.user.bot) {
          fields.push({ name: `${language_result.guildBanRemove.ban_bot_embed}`, value: `${language_result.guildBanRemove.ban_bot_response}`, inline: true });
        }

        if (ban.reason) {
          fields.push({ name: `${language_result.guildBanRemove.ban_reason_embed}`, value: `${ban.reason}` });
        }
        else {
          fields.push({ name: ` `, value: ` ` });
        }

        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.guildBanRemove.ban_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setDescription(language_result.guildBanRemove.ban_remove)
          .setColor(colors.general.success);
        if (ban.user.avatar) {
          embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${ban.user.id}/${ban.user.avatar}.png`);
        }
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, ban.guil.client, ban.guild, "\\logs_system\\GuildBanRemove.js", variables);
    }
  },
};