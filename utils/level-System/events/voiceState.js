// Code: utils/level-system/events/voiceState.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file voiceState.js
 * @module voiceState
 * @description Questo file contiene l'evento per il sistema di livelli
 */

const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { runDb, readDb, readDbAll, readDbAllWithParams } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const { channel } = require('diagnostics_channel');
const internal = require('stream');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

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
    const configLevelsSystem = await readDb(`SELECT * from levels_config WHERE guilds_id = ?`, newState.guild.id);
await runDb("UPDATE levels SET exp = ?, levels = ? WHERE guilds_id = ? AND users_id = ?", checkUser.exp - (75 + (25 * checkUser.levels)), checkUser.levels + 1, newState.guild.id, newState.member.id);
const channel = await newState.guild.channels.fetch(configLevelsSystem.log_channel);

    let data = await language.databaseCheck(newState.guild.id);
    const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
    const language_result = JSON.parse(langagues_path);

let checkRoles = await readDbAll("SELECT * FROM levels_roles WHERE guilds_id = ?", newState.guild.id);
    checkRoles.map(async value => {
      if ((checkUser.levels + 1) >= value.level) {
        try {
          let roleResolve = await newState.guild.roles.fetch(value.roles_id)
          await newState.member.roles.add(roleResolve)
        } catch (error) {
          console.log(error)
        }
      }
    })
checkUser = await readDb("SELECT * FROM levels WHERE guilds_id = ? AND users_id = ?", newState.guild.id, newState.member.id);
    if(checkUser.exp >= 75 + (25 * checkUser.levels)) {
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
        if ((oldState.channel == null || oldState.guild.afkChannel?.id == oldState.channel?.id) && newState.channel != null) {
          if (newState.guild.afkChannel?.id != newState.channel?.id) {
            if (await checkFeaturesIsEnabled(oldState.guild, 11)) {
              let checkUser = await readDb("SELECT * FROM levels WHERE guilds_id = ? AND users_id = ?", newState.guild.id, newState.member.id);
              if (checkUser) {
                await runDb("UPDATE levels SET joined_time = ? WHERE guilds_id = ? AND users_id = ?", `${Date.now()}`,  newState.guild.id, newState.member.id);
              } else {
                //await checkUsersDb(newState.member, newState.guild);
                await runDb('INSERT INTO levels (guilds_id, users_id, joined_time) VALUES (?, ?, ?)', newState.guild.id, newState.member.id, `${Date.now()}`);
              }
            }
          }

        } else if (!newState.channel || newState.guild.afkChannel?.id == newState.channel?.id) {
          let checkUser = await readDb("SELECT * FROM levels WHERE guilds_id = ? AND users_id = ?", newState.guild.id, newState.member.id);
          if (checkUser && (checkUser.joined_time != null && checkUser.joined_time > 0)) {
                await runDb('UPDATE levels SET exp = ?, minute_vocal = ?, joined_time = ? WHERE guilds_id = ? AND users_id = ?', checkUser.exp + (getMinutesBetweenTimestamps(+checkUser.joined_time)*3), checkUser.minute_vocal + (getMinutesBetweenTimestamps(+checkUser.joined_time)), null, newState.guild.id, newState.member.id);

            checkUser = await readDb("SELECT * FROM levels WHERE guilds_id = ? AND users_id = ?", newState.guild.id, newState.member.id);

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