const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT guildBanState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.GuildBanAdd,
  async execute(ban) {
    let customEmoji = await getEmojifromUrl(ban.guild.client, "ban");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.getValueDatabase(sqlEnabledFeature, ban.guild.id, (result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.getValueDatabase(sqlChannelId_log, ban.guild.id, async (result) => {
        try {

          if (!result?.guildBanState_channel) return;
          if (result.guildBanState_channel?.length < 5) return;
          // CONTROLLO DELLA LINGUA
          if (ban.guild?.id) {
            let data = await language.databaseCheck(ban.guild.id);
            const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
            const language_result = JSON.parse(langagues_path);
  
            let channel_logs = await ban.guild.channels.fetch(result.guildBanState_channel);
            const fields = [];
            fields.push(
              { name: `${language_result.guildBanAdd.ban_user}`, value: `${ban.user}`, inline: true },
              { name: `${language_result.guildBanAdd.ban_user_id}`, value: `${ban.user.id}`, inline: true },
              { name: " ", value: " " },
              { name: `${language_result.guildBanAdd.ban_username}`, value: `${ban.user.username}`, inline: true }
            );
  
            if (ban.user.bot) {
              fields.push({ name: `${language_result.guildBanAdd.ban_bot_embed}`, value: `${language_result.guildBanAdd.ban_bot_response}`, inline: true });
            }
  
            if (ban.reason) {
              fields.push({ name: `${language_result.guildBanAdd.ban_reason_embed}`, value: `${ban.reason}` });
            }
            else {
              fields.push({ name: ` `, value: ` ` });
            }
  
            const embedLog = new EmbedBuilder()
              .setAuthor({ name: `${language_result.guildBanAdd.ban_title}`, iconURL: customEmoji })
              .addFields(fields)
              .setFooter({ text: `${language_result.guildBanAdd.ban_footer}`, iconURL: `${language_result.guildBanAdd.ban_icon_url}` })
              .setDescription(language_result.guildBanAdd.ban_create)
              .setColor(0x9e1313);
            if (ban.user.avatar) {
              embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${ban.user.id}/${ban.user.avatar}.png`);
            }
            channel_logs.send({ embeds: [embedLog] });
          }
        }
        catch (error) {
          errorSendControls(error, ban.client, ban.guild, "\\logs_system\\GuildBanAdd.js");
        }
      });
    });
  },
};