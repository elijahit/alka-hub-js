const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');

// QUERY DEFINITION
let sql = `SELECT * FROM logs_system WHERE guilds_id = ?`;
// ------------ //

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    let customEmoji = emoji.logsSystem.mewMemberMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, member.guild.id);
    if (!resultDb) return;
    if (resultDb["is_enabled"] != 1) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      if (!resultDb["join_member_channel"]) return;
      // CONTROLLO DELLA LINGUA
      if (member.guild?.id) {
        let data = await language.databaseCheck(member.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

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
          .setFooter({ text: `${language_result.guildMemberAdd.embed_footer}`, iconURL: `${language_result.guildMemberAdd.embed_icon_url}` })
          .setDescription(language_result.guildMemberAdd.embed_description)
          .setColor(colors.general.success);
        if (member.user.avatar) {
          embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`);
        }
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, member.client, member.guild, "\\logs_system\\GuildMemberAdd.js");
    }

  },
};