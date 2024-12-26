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
const { findLevelsConfigByGuildId, findByGuildIdAndUserIdLevel, updateLevel, findAllLevelsRolesByGuildId, createLevel } = require('../../../bin/service/DatabaseService');
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
  async execute(message) {
    try {
      if (!message?.member?.user?.bot) {
        if (!await checkFeatureSystemDisabled(11)) return;
        if (!await checkFeaturesIsEnabled(message.guild.id, 11)) return;
        if (!await checkPremiumFeature(message.guild.id, 11)) return;
        let levelsConfig = await findLevelsConfigByGuildId(message.guild.id);
        levelsConfig = levelsConfig?.get({ plain: true });
        if (!levelsConfig) return;

        let checkUser = await findByGuildIdAndUserIdLevel(message.guild.id, message.member.id);
        checkUser = checkUser?.get({ plain: true });
        if (checkUser) {
          if (checkUser.exp >= 75 + (25 * checkUser.level)) {
            await updateLevel({
              exp: checkUser.exp - (75 + (25 * checkUser.level)) + getRandomInt(5, 10),
              level: checkUser.level + 1,
              message_count: checkUser.message_count + 1
            }, { where: { guild_id: message.guild.id, user_id: message.member.id, config_id: Variables.getConfigId() } });

            const channel = await message.guild.channels.fetch(levelsConfig.log_channel);

            let data = await language.databaseCheck(message.guild.id);
            const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
            const language_result = JSON.parse(langagues_path);

            const customEmoji = emoji.levelsSystem.levelsMaker;

            let checkRoles = await findAllLevelsRolesByGuildId(message.guild.id);
            checkRoles.map(async value => {
              if ((checkUser.level + 1) >= value.level) {
                try {
                  let roleResolve = await message.guild.roles.fetch(value.role_id)
                  await message.member.roles.add(roleResolve)
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

            const embedLog = new EmbedBuilder()
              .setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
              .setDescription(language_result.levelsCommand.newLevel_embed.replace("{0}", message.member).replace("{1}", checkUser.level + 1))
              .setFooter({ text: `${language_result.levelsCommand.newLevel_footer.replace("{0}", checkUser.minute_vocal == null ? 0 : checkUser.minute_vocal).replace("{1}", checkUser.message_count == null ? 0 : checkUser.message_count)}`, iconURL: Variables.getBotFooterIcon() })
              .setColor(colors.general.blue);
            await channel.send({ content: `${message.member}`, embeds: [embedLog] });
          } else {
            await updateLevel({
              exp: checkUser.exp + getRandomInt(5, 10),
              message_count: checkUser.message_count + 1
            }, { where: { guild_id: message.guild.id, user_id: message.member.id, config_id: Variables.getConfigId() } });
          }
        } else {
          await addUserGuild(message.member.id, message.guild.id);
          await createLevel(message.guild.id, message.member.id, getRandomInt(5, 10), 1);
        }
      }
    }
    catch (error) {
      errorSendControls(error, message.guild.client, message.guild, "\\levels-system\\voiceState.js");
    }
  },
};