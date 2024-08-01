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

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    try {
      if(!message.member.user.bot) { 
        const checkFuncs = await readDbAllWith1Params(`SELECT * from levels_server_system WHERE guild_id = ?`, message.guild.id);
        if (checkFuncs.length > 0) {
            let checkUser = await readDbAllWith2Params("SELECT * FROM levels_server_users WHERE guild_id = ? AND user_id = ?", message.guild.id, message.member.id);
            if (checkUser.length > 0) {
              if (checkUser[0].exp >= 100) {
                await runDb("UPDATE levels_server_users SET exp = ?, level = ?, message_count = ? WHERE guild_id = ? AND user_id = ?", checkUser[0].exp - 100 + getRandomInt(5, 10), checkUser[0].level + 1, checkUser[0].message_count + 1, message.guild.id, message.member.id);
  
                const channel = await message.guild.channels.fetch(checkFuncs[0].channel_id);
  
                let data = await language.databaseCheck(message.guild.id);
                const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
                const language_result = JSON.parse(langagues_path);
  
                const customEmoji = await getEmojifromUrl(message.guild.client, "levels");

                let checkRoles = await readDbAllWith1Params("SELECT * FROM levels_server_roles WHERE guild_id = ?", message.guild.id);
                checkRoles.map(async value => {
                  if((checkUser[0].level+1) >= value.level) {
                    let roleResolve = await message.guild.roles.fetch(value.role_id)
                    await message.member.roles.add(roleResolve)
                  }
                })

                const embedLog = new EmbedBuilder()
                  .setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
                  .setDescription(language_result.levelsCommand.newLevel_embed.replace("{0}", message.member).replace("{1}", checkUser[0].level + 1))
                  .setFooter({ text: `${language_result.levelsCommand.newLevel_footer.replace("{0}", checkUser[0].minute_vocal == null ? 0 : checkUser[0].minute_vocal).replace("{1}", checkUser[0].message_count == null ? 0 : checkUser[0].message_count)}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
                  .setColor(0x7a090c);
                await channel.send({ content: `${message.member}`, embeds: [embedLog] });
              } else {
                await runDb("UPDATE levels_server_users SET exp = ?, message_count = ? WHERE guild_id = ? AND user_id = ?", checkUser[0].exp + getRandomInt(5, 10), checkUser[0].message_count + 1, message.guild.id, message.member.id);
              }
            } else {
              await runDb('INSERT INTO levels_server_users (guild_id, user_id, exp, message_count) VALUES (?, ?, ?, ?)', message.guild.id, message.member.id, getRandomInt(5, 10), 1);
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