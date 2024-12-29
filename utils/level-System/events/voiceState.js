// Code: utils/level-system/events/voiceState.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file voiceState.js
 * @module voiceState
 * @description Questo file contiene l'evento per il sistema di livelli
 */

const { Events, EmbedBuilder } = require('discord.js');
const { readFileSync} = require('fs');
const language = require('../../../languages/languages');
const { errorSendControls } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const { findByGuildIdAndUserIdLevel, addUserGuild, createLevel, updateLevel, findAllLevelsRolesByGuildId, findLevelsConfigByGuildId } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function getMinutesBetweenTimestamps(startTimestamp) {
  // Convert timestamps to milliseconds

  // Create Date objects from the timestamps
  const startDate = new Date(startTimestamp);
  const endDate = Date.now();

  // Calculate the difference in milliseconds
  const differenceMillis = endDate - startDate;

  // Convert milliseconds to minutes
  const differenceMinutes = Math.floor(differenceMillis / 60000);

  return differenceMinutes;
}

async function checkExp(newState, checkUser) {
  if (checkUser.exp >= 75 + (25 * checkUser.levels)) {
    let configLevelsSystem = await findLevelsConfigByGuildId(newState.guild.id);
    configLevelsSystem = configLevelsSystem?.get({ plain: true });
    if (!configLevelsSystem) return;
    await updateLevel({
      level: checkUser.level + 1,
      exp: checkUser.exp - (75 + (25 * checkUser.levels))
    }, { where: { guild_id: newState.guild.id, user_id: newState.member.id, config_id: Variables.getConfigId() } });

    const channel = await newState.guild.channels.fetch(configLevelsSystem.log_channel);

    let data = await language.databaseCheck(newState.guild.id);
    const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
    const language_result = JSON.parse(langagues_path);

    let checkRoles = await findAllLevelsRolesByGuildId(newState.guild.id);
    checkRoles.map(async value => {
      if ((checkUser.level + 1) >= value.level) {
        try {
          let roleResolve = await newState.guild.roles.fetch(value.role_id)
          await newState.member.roles.add(roleResolve)
        } catch (error) {
          if (error == "DiscordAPIError[50013]: Missing Permissions") {
            let roleResolve = await message.guild.roles.fetch(value.role_id)
            const embedLog = new EmbedBuilder()
              .setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: emoji.general.errorMarker })
              .setDescription(language_result.levelsCommand.missing_permissions.replace("{0}", roleResolve).replace("{1}", message.member))
              .setFooter({ text: Variables.getBotFooter(), iconURL: Variables.getBotFooterIcon() })
              .setColor(colors.general.error);
            await channel.send({ embeds: [embedLog] });
          } else {
            errorSendControls(error, message.guild.client, message.guild, "\\levels-system\\voiceState.js");
          }
        }
      }
    })
    let checkUser = await findByGuildIdAndUserIdLevel(newState.guild.id, newState.member.id);
    checkUser = checkUser?.get({ plain: true });
    if (checkUser.exp >= 75 + (25 * checkUser.level)) {
      return await checkExp(newState, checkUser);
    }
    const customEmoji = emoji.levelsSystem.levelsMaker;
    const embedLog = new EmbedBuilder()
      .setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
      .setDescription(language_result.levelsCommand.newLevel_embed.replace("{0}", newState.member).replace("{1}", checkUser.levels))
      .setFooter({ text: `${language_result.levelsCommand.newLevel_footer.replace("{0}", checkUser.minute_vocal == null ? 0 : checkUser.minute_vocal).replace("{1}", checkUser.message_count == null ? 0 : checkUser.message_count)}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
      .setColor(colors.general.error);
    await channel.send({ content: `${newState.member}`, embeds: [embedLog] });

  }
}

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    try {
      if (!newState.member.user.bot) {
        if (!await checkFeatureSystemDisabled(11)) return;
        if (!await checkFeaturesIsEnabled(newState.guild.id, 11)) return;
        if (!await checkPremiumFeature(newState.guild.id, 11)) return;

        if ((oldState.channel == null || oldState.guild.afkChannel?.id == oldState.channel?.id) && newState.channel != null) {
          if (newState.guild.afkChannel?.id != newState.channel?.id) {
            let checkUser = await findByGuildIdAndUserIdLevel(newState.guild.id, newState.member.id);
            checkUser = checkUser?.get({ plain: true });
            if (checkUser) {
              await updateLevel({
                joined_time: Date.now()
              }, { where: { guild_id: newState.guild.id, user_id: newState.member.id, config_id: Variables.getConfigId() } });
            } else {
              await addUserGuild(newState.member.id, newState.guild.id, newState.member.user.username);
              await createLevel(newState.member.id, newState.guild.id, 0, 0, Date.now());
            }
          }

        } else if (!newState.channel || newState.guild.afkChannel?.id == newState.channel?.id) {
          let checkUser = await findByGuildIdAndUserIdLevel(newState.guild.id, newState.member.id);
          checkUser = checkUser?.get({ plain: true });
          if (checkUser && (checkUser.joined_time != null && checkUser.joined_time > 0)) {
            await updateLevel({
              joined_time: null,
              minute_vocal: checkUser.minute_vocal + (getMinutesBetweenTimestamps(+checkUser.joined_time)),
              exp: checkUser.exp + (getMinutesBetweenTimestamps(+checkUser.joined_time) * 3)
            }, { where: { guild_id: newState.guild.id, user_id: newState.member.id, config_id: Variables.getConfigId() } });

            await checkExp(newState, checkUser);
          }
        }

      }
    }
    catch (error) {
      console.log(error)
      errorSendControls(error, newState.guild.client, newState.guild, "\\levels-system\\voiceState.js");
    }
  },
};