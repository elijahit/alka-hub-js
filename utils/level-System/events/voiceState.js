const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { readDbAllWith2Params, runDb, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const { channel } = require('diagnostics_channel');
const internal = require('stream');

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
  if (checkUser[0].exp >= 75 + (25 * checkUser[0].level)) {
    const checkFuncs = await readDbAllWith1Params(`SELECT * from levels_server_system WHERE guild_id = ?`, newState.guild.id);
    
    await runDb("UPDATE levels_server_users SET exp = ?, level = ? WHERE guild_id = ? AND user_id = ?", checkUser[0].exp - (75 + (25 * checkUser[0].level)), checkUser[0].level + 1, newState.guild.id, newState.member.id);
    
    const channel = await newState.guild.channels.fetch(checkFuncs[0].channel_id);

    let data = await language.databaseCheck(newState.guild.id);
    const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
    const language_result = JSON.parse(langagues_path);

    
    let checkRoles = await readDbAllWith1Params("SELECT * FROM levels_server_roles WHERE guild_id = ?", newState.guild.id);
    checkRoles.map(async value => {
      if ((checkUser[0].level + 1) >= value.level) {
        try {
          let roleResolve = await newState.guild.roles.fetch(value.role_id)
          await newState.member.roles.add(roleResolve)
        } catch (error) {
          console.log(error)
        }
      }
    })
    
    checkUser = await readDbAllWith2Params("SELECT * FROM levels_server_users WHERE guild_id = ? AND user_id = ?", newState.guild.id, newState.member.id);
    if(checkUser[0].exp >= 75 + (25 * checkUser[0].level)) {
      return await checkExp(newState, checkUser);
    }
    
    const customEmoji = await getEmojifromUrl(newState.guild.client, "levels");
    const embedLog = new EmbedBuilder()
      .setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
      .setDescription(language_result.levelsCommand.newLevel_embed.replace("{0}", newState.member).replace("{1}", checkUser[0].level))
      .setFooter({ text: `${language_result.levelsCommand.newLevel_footer.replace("{0}", checkUser[0].minute_vocal == null ? 0 : checkUser[0].minute_vocal).replace("{1}", checkUser[0].message_count == null ? 0 : checkUser[0].message_count)}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
      .setColor(0x7a090c);
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
            const checkFuncs = await readDbAllWith1Params(`SELECT * from levels_server_system WHERE guild_id = ?`, newState.guild.id);
            if (checkFuncs.length > 0) {
              let checkUser = await readDbAllWith2Params("SELECT * FROM levels_server_users WHERE guild_id = ? AND user_id = ?", newState.guild.id, newState.member.id);
              if (checkUser.length > 0) {
                await runDb("UPDATE levels_server_users SET join_timestamp = ? WHERE guild_id = ? AND user_id = ?", `${Date.now()}`,  newState.guild.id, newState.member.id);
              } else {
                await runDb('INSERT INTO levels_server_users (guild_id, user_id, join_timestamp) VALUES (?, ?, ?)', newState.guild.id, newState.member.id, `${Date.now()}`);
              }
            }
          }

        } else if (!newState.channel || newState.guild.afkChannel?.id == newState.channel?.id) {
          let checkUser = await readDbAllWith2Params("SELECT * FROM levels_server_users WHERE guild_id = ? AND user_id = ?", newState.guild.id, newState.member.id);
          if (checkUser.length > 0 && (checkUser[0].join_timestamp != null && checkUser[0].join_timestamp > 0)) {
            
            await runDb('UPDATE levels_server_users SET exp = ?, minute_vocal = ?, join_timestamp = ? WHERE guild_id = ? AND user_id = ?', checkUser[0].exp + (getMinutesBetweenTimestamps(+checkUser[0].join_timestamp)*3), checkUser[0].minute_vocal + (getMinutesBetweenTimestamps(+checkUser[0].join_timestamp)), null, newState.guild.id, newState.member.id);

            checkUser = await readDbAllWith2Params("SELECT * FROM levels_server_users WHERE guild_id = ? AND user_id = ?", newState.guild.id, newState.member.id);

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