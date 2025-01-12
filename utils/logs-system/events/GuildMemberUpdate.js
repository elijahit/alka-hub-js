// Code: utils/logs-system/events/GuildMemberUpdate.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file GuildMemberUpdate.js
 * @module GuildMemberUpdate
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
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember, variables) {
    let customEmoji = emoji.logsSystem.updateMemberMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(oldMember.guild.id, 1, variables)) return;
    if (!await checkPremiumFeature(oldMember.guild.id, 1, variables)) return;
    try {
      // CONTROLLO DELLA LINGUA
      if (oldMember.guild?.id) {
        let data = await language.databaseCheck(oldMember.guild.id, variables);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(oldMember.guild.id, variables);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["member_state_channel"]) return;

        let channelLogs = await oldMember.guild.channels.fetch(resultDb["member_state_channel"]);
        const fields = [];
        let changeCheck = false;

        fields.push(
          { name: `${language_result.guildMemberUpdate.embed_user}`, value: `${oldMember}`, inline: true },
          { name: `${language_result.guildMemberUpdate.embed_id}`, value: `${oldMember.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.guildMemberUpdate.embed_username}`, value: `${oldMember.user.username}`, inline: true }
        );

        if (oldMember.user.bot) {
          fields.push({ name: `${language_result.guildMemberUpdate.bot_embed}`, value: `${language_result.guildMemberUpdate.bot_embed_response}`, inline: true });
        }

        fields.push({ name: " ", value: " " });

        if (oldMember.nickname != newMember.nickname) {
          changeCheck = true;
          let nicknameOld, nicknameNew;

          if (!oldMember.nickname) {
            nicknameOld = language_result.guildMemberUpdate.empty_name;
          } else {
            nicknameOld = oldMember.nickname;
          }

          if (!newMember.nickname) {
            nicknameNew = language_result.guildMemberUpdate.empty_name;
          } else {
            nicknameNew = newMember.nickname;
          }

          fields.push(
            { name: `${language_result.guildMemberUpdate.old_name}`, value: `${nicknameOld}`, inline: true },
            { name: `${language_result.guildMemberUpdate.new_name}`, value: `${nicknameNew}`, inline: true }
          )
        }

        fields.push({ name: " ", value: " " });

        if (oldMember._roles.length != newMember._roles.length) {
          changeCheck = true;
          if (oldMember._roles) {
            let rolesContainer = " ";
            await oldMember._roles.forEach(async value => {
              let roles = await oldMember.guild.roles.fetch(value);
              rolesContainer += `${roles} \n`;
            });
            fields.push({ name: `${language_result.guildMemberUpdate.old_role}`, value: `${rolesContainer}`, inline: true });
          }

          if (newMember._roles) {
            let rolesContainer = " ";
            await newMember._roles.forEach(async value => {
              let roles = await newMember.guild.roles.fetch(value);
              rolesContainer += `${roles} \n`;
            });
            fields.push({ name: `${language_result.guildMemberUpdate.new_role}`, value: `${rolesContainer}`, inline: true });
          }
        }
        if (!changeCheck) return;
        const embedLog = new EmbedBuilder()
          .addFields(fields)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setDescription(`## ${language_result.guildMemberUpdate.embed_title}\n` + language_result.guildMemberUpdate.embed_description)
          .setThumbnail(variables.getBotFooterIcon())
          .setColor(colors.general.blue);
        if (oldMember.user.avatar) {
          embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${oldMember.id}/${oldMember.user.avatar}.png`);
        }
        try {
          channelLogs.send({ embeds: [embedLog] });;
        }
        catch {
          return;
        }
      }
    }
    catch (error) {
      errorSendControls(error, oldMember.client, oldMember.guild, "\\logs_system\\GuildMemberUpdate.js", variables);
    }
  },
};