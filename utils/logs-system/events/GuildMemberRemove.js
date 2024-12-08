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
  name: Events.GuildMemberRemove,
  async execute(member) {
    let customEmoji = emoji.logsSystem.exitMemberMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(member.guild.id, 1)) return;
    if (!await checkPremiumFeature(member.guild.id, 1)) return;
    try {
      // CONTROLLO DELLA LINGUA
      if (member.guild?.id) {
        let data = await language.databaseCheck(member.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(member.guild.id);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["exit_member_channel"]) return;

        let channel_logs = await member.guild.channels.fetch(resultDb["exit_member_channel"]);
        const fields = [];

        fields.push(
          { name: `${language_result.guildMemberRemove.embed_user}`, value: `${member}`, inline: true },
          { name: `${language_result.guildMemberRemove.embed_id}`, value: `${member.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.guildMemberRemove.embed_username}`, value: `${member.user.username}`, inline: true }
        );

        if (member.user.bot) {
          fields.push({ name: `${language_result.guildMemberRemove.bot_embed}`, value: `${language_result.guildMemberRemove.bot_embed_response}`, inline: true });
        }

        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.guildMemberRemove.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
          .setDescription(language_result.guildMemberRemove.embed_description)
          .setColor(colors.general.error);
        if (member.user.avatar) {
          embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`);
        }
        channel_logs.send({ embeds: [embedLog] })
      }
    }
    catch (error) {
      errorSendControls(error, member.client, member.guild, "\\logs_system\\GuildMemberRemove.js");
    }
  },
};