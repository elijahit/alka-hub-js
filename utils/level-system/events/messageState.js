// Code: utils/level-system/events/messageState.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file messageState.js
 * @module messageState
 * @description Questo file contiene l'evento per il sistema di livelli
 */

const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { runDb, readDbAll, readDb, readDbAllWithParams } = require('../../../bin/database');
const { errorSendControls, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const internal = require('stream');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { findLevelsConfigByGuildId, findByGuildIdAndUserIdLevel, updateLevel, findAllLevelsRolesByGuildId, createLevel, addUserGuild } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message, variables) {
    try {
      if (!message?.member?.user?.bot) {
        if (!await checkFeatureSystemDisabled(11)) return;
        if (!await checkFeaturesIsEnabled(message.guild.id, 11, variables)) return;
        if (!await checkPremiumFeature(message.guild.id, 11, variables)) return;
        let levelsConfig = await findLevelsConfigByGuildId(message.guild.id, variables);
        levelsConfig = levelsConfig?.get({ plain: true });
        if (!levelsConfig) return;
        if(!message?.guild?.id || !message?.member?.id) return;  
        let checkUser = await findByGuildIdAndUserIdLevel(message.guild.id, message.member.id, variables);
        checkUser = checkUser?.get({ plain: true });
        if (checkUser) {
          if (checkUser.exp >= 75 + (25 * checkUser.level)) {
            await updateLevel({
              exp: checkUser.exp - (75 + (25 * checkUser.level)) + getRandomInt(5, 10),
              level: checkUser.level + 1,
              message_count: checkUser.message_count + 1
            }, { where: { guild_id: message.guild.id, user_id: message.member.id, config_id: variables.getConfigId() } });

            const channel = await message.guild.channels.fetch(levelsConfig.log_channel);

            let data = await language.databaseCheck(message.guild.id, variables);
            const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
            const language_result = JSON.parse(langagues_path);


            let checkRoles = await findAllLevelsRolesByGuildId(message.guild.id, variables);
            checkRoles.map(async value => {
              if ((checkUser.level + 1) >= value.level) {
                try {
                  let roleResolve = await message.guild.roles.fetch(value.role_id)
                  await message.member.roles.add(roleResolve)
                } catch (error) {
                  if (error == "DiscordAPIError[50013]: Missing Permissions") {
                    let roleResolve = await message.guild.roles.fetch(value.role_id)
                    const embedLog = new EmbedBuilder()
                      .setDescription(`## ${language_result.levelsCommand.embed_title}\n` + language_result.levelsCommand.missing_permissions.replace("{0}", roleResolve).replace("{1}", message.member))
                      .setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
                      .setThumbnail(variables.getBotFooterIcon())
                      .setColor(colors.general.error);
                    await channel.send({ embeds: [embedLog] });
                  } else {
                    errorSendControls(error, message.guild.client, message.guild, "\\levels-system\\voiceState.js", variables);
                  }

                }
              }
            })

            const embedLog = new EmbedBuilder()
              .setDescription(`## ${language_result.levelsCommand.embed_title}\n` + language_result.levelsCommand.newLevel_embed.replace("{0}", message.member).replace("{1}", checkUser.level + 1))
              .setFooter({ text: `${language_result.levelsCommand.newLevel_footer.replace("{0}", checkUser.minute_vocal == null ? 0 : checkUser.minute_vocal).replace("{1}", checkUser.message_count == null ? 0 : checkUser.message_count)}`, iconURL: variables.getBotFooterIcon() })
              .setThumbnail(variables.getBotFooterIcon())
              .setColor(colors.general.blue);
            await channel.send({ content: `${message.member}`, embeds: [embedLog] });
          } else {
            await updateLevel({
              exp: checkUser.exp + getRandomInt(5, 10),
              message_count: checkUser.message_count + 1
            }, { where: { guild_id: message.guild.id, user_id: message.member.id, config_id: variables.getConfigId() } });
          }
        } else {
          await addUserGuild(message.member.id, message.guild.id, message.member.user.username);
          await createLevel(message.member.id, message.guild.id, 1, getRandomInt(5, 10), null, variables);
        }
      }
    }
    catch (error) {
      errorSendControls(error, message.guild.client, message.guild, "\\levels-system\\voiceState.js", variables);
    }
  },
};