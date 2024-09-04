const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync, read } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');

// QUERY DEFINITION
let sql = `SELECT * FROM logs_system WHERE guilds_id = ?`;
// ------------ //

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    let customEmoji = emoji.logsSystem.exitMemberMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    try {
      const resultDb = await readDb(sql, member.guild.id);
      if (!resultDb) return;
      if (resultDb["is_enabled"] != 1) return;
      if(!resultDb["exit_member_channel"]) return;
      // CONTROLLO DELLA LINGUA
      if (member.guild?.id) {
        let data = await language.databaseCheck(member.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

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
          .setFooter({ text: `${language_result.guildMemberRemove.embed_footer}`, iconURL: `${language_result.guildMemberRemove.embed_icon_url}` })
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