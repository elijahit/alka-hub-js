const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT guildMemberState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    let customEmoji = await getEmojifromUrl(member.client, "memberadd");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.getValueDatabase(sqlEnabledFeature, member.guild.id, (result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.getValueDatabase(sqlChannelId_log, member.guild.id, async (result) => {
        try {
          if (!result?.guildMemberState_channel) return;
          if (result.guildMemberState_channel?.length < 5) return;
          // CONTROLLO DELLA LINGUA
          if (member.guild?.id) {
            let data = await language.databaseCheck(member.guild.id);
            const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
            const language_result = JSON.parse(langagues_path);
  
            let channel_logs = await member.guild.channels.fetch(result.guildMemberState_channel);
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
              .setColor(0x368c29);
            if (member.user.avatar) {
              embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`);
            }
            channel_logs.send({ embeds: [embedLog] });
          }
        }
        catch (error) {
          errorSendControls(error, member.client, member.guild, "\\logs_system\\GuildMemberAdd.js");
        }
      });
    });
  },
};