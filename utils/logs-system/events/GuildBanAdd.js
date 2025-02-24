// Code: utils/logs-system/events/GuildBanAdd.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file GuildBanAdd.js
 * @module GuildBanAdd
 * @description Questo file contiene l'evento per il sistema di Logs
 */

const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const {readDb} = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { findLogsByGuildId, createUserReports } = require('../../../bin/service/DatabaseService');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');

module.exports = {
  name: Events.GuildBanAdd,
  async execute(ban, variables) {
    if(ban.user.bot) return;
    
    // CREAZIONE DELLA SEGNALAZIONE
    await createUserReports(ban.user.id, ban.guild.id, 0, ban.reason ?? "No reason provided", 0);

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
          { name: `${language_result.guildBanAdd.ban_user}`, value: `${ban.user}`, inline: true },
          { name: `${language_result.guildBanAdd.ban_user_id}`, value: `${ban.user.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.guildBanAdd.ban_username}`, value: `${ban.user.username}`, inline: true }
        );

        if (ban.user.bot) {
          fields.push({ name: `${language_result.guildBanAdd.ban_bot_embed}`, value: `${language_result.guildBanAdd.ban_bot_response}`, inline: true });
        }

        if (ban.reason) {
          fields.push({ name: `${language_result.guildBanAdd.ban_reason_embed}`, value: `${ban.reason}` });
        }
        else {
          fields.push({ name: ` `, value: ` ` });
        }

        const embedLog = new EmbedBuilder()
          .addFields(fields)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setDescription(`## ${language_result.guildBanAdd.ban_title}\n` + language_result.guildBanAdd.ban_create)
          .setThumbnail(variables.getBotFooterIcon())
          .setColor(colors.general.error);
        if (ban.user.avatar) {
          embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${ban.user.id}/${ban.user.avatar}.png`);
        }
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, ban.client, ban.guild, "\\logs_system\\GuildBanAdd.js", variables);
    }
  },
};