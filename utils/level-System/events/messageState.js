const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { runDb, readDbAll, readDb, readDbAllWithParams } = require('../../../bin/database');
const { errorSendControls, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const internal = require('stream');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkUsersDb = require('../../../bin/functions/checkUsersDb');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

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
        if(!await allCheckFeatureForCommands(interaction, interaction.guild.id, 11, language_result.noPermission.description_embed_no_features_by_system, 
          language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature, 
          language_result.noPermission.description_embed_no_features)) return;
          
        const levelsConfig = await readDb(`SELECT * from levels_config WHERE guilds_id = ?`, message.guild.id);
        let checkUser = await readDb("SELECT * FROM levels WHERE guilds_id = ? AND users_id = ?", message.guild.id, message.member.id);
        if (checkUser) {
          if (checkUser.exp >= 75 + (25 * checkUser.levels)) {
            await runDb("UPDATE levels SET exp = ?, levels = ?, message_count = ? WHERE guilds_id = ? AND users_id = ?", checkUser.exp - (75 + (25 * checkUser.levels)) + getRandomInt(5, 10), checkUser.levels + 1, checkUser.message_count + 1, message.guild.id, message.member.id);

            const channel = await message.guild.channels.fetch(levelsConfig.log_channel);

            let data = await language.databaseCheck(message.guild.id);
            const langagues_path = readFileSync(`./languages/levels-system/${data}.json`);
            const language_result = JSON.parse(langagues_path);

            const customEmoji = emoji.levelsSystem.levelsMaker;

            let checkRoles = await readDbAll("SELECT * FROM levels_roles WHERE guilds_id = ?", message.guild.id);
            checkRoles.map(async value => {
              if ((checkUser.levels + 1) >= value.levels) {
                try {
                  let roleResolve = await message.guild.roles.fetch(value.roles_id)
                  await message.member.roles.add(roleResolve)
                } catch (error) {
                  console.log(error)
                }
              }
            })

            const embedLog = new EmbedBuilder()
              .setAuthor({ name: `${language_result.levelsCommand.embed_title}`, iconURL: customEmoji })
              .setDescription(language_result.levelsCommand.newLevel_embed.replace("{0}", message.member).replace("{1}", checkUser.levels + 1))
              .setFooter({ text: `${language_result.levelsCommand.newLevel_footer.replace("{0}", checkUser.minute_vocal == null ? 0 : checkUser.minute_vocal).replace("{1}", checkUser.message_count == null ? 0 : checkUser.message_count)}`, iconURL: `${language_result.levelsCommand.embed_icon_url}` })
              .setColor(colors.general.blue);
            await channel.send({ content: `${message.member}`, embeds: [embedLog] });
          } else {
            await runDb("UPDATE levels SET exp = ?, message_count = ? WHERE guilds_id = ? AND users_id = ?", checkUser.exp + getRandomInt(5, 10), checkUser.message_count + 1, message.guild.id, message.member.id);
          }
        } else {
          await checkUsersDb(message.member, message.guild);
          await runDb('INSERT INTO levels (guilds_id, users_id, exp, message_count) VALUES (?, ?, ?, ?)', message.guild.id, message.member.id, getRandomInt(5, 10), 1);
        }
      }
    }
    catch (error) {
      console.log(error)
      errorSendControls(error, message.guild.client, message.guild, "\\levels-system\\voiceState.js");
    }
  },
};