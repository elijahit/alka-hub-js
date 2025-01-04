// Code: utils/logs-system/events/GuildMemberAdd.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file GuildMemberAdd.js
 * @module GuildMemberAdd
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
const { findLogsByGuildId, addUserGuild } = require('../../../bin/service/DatabaseService');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const Variables = require('../../../bin/classes/GlobalVariables');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, variables) {
    await addUserGuild(member.id, member.guild.id, member.user.username, variables);
    let customEmoji = emoji.logsSystem.newMemberMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(member.guild.id, 1, variables)) return;
    if (!await checkPremiumFeature(member.guild.id, 1, variables)) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (member.guild?.id) {
        let data = await language.databaseCheck(member.guild.id, variables);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(member.guild.id, variables);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["join_member_channel"]) return;

        let channel_logs = await member.guild.channels.fetch(resultDb["join_member_channel"]);
        const fields = [];

        fields.push(
          { name: `${language_result.guildMemberAdd.embed_user}`, value: `${member}`, inline: true },
          { name: `${language_result.guildMemberAdd.embed_id}`, value: `${member.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.guildMemberAdd.embed_username}`, value: `${member.user.username}`, inline: true }
        );

        if (member.user.bot) {
          fields.push({ name: `${language_result.guildMemberAdd.bot_embed}`, value: `${language_result.guildMemberAdd.bot_embed_response}`, inline: true });
        }

        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.guildMemberAdd.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setDescription(language_result.guildMemberAdd.embed_description)
          .setColor(colors.general.success);
        if (member.user.avatar) {
          embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`);
        }
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, member.client, member.guild, "\\logs_system\\GuildMemberAdd.js", variables);
    }

  },
};