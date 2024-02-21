const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT guildBanState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.GuildBanRemove,
  async execute(ban) {
    let customEmoji = await getEmojifromUrl(ban.guild.client, "unban");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const result_Db = await readDb(sqlEnabledFeature, ban.guild.id);
    if (!result_Db) return;
    if (result_Db.logSystem_enabled != 1) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    const result = await readDb(sqlChannelId_log, ban.guild.id);
    try {
      if (!result?.guildBanState_channel) return;
      if (result.guildBanState_channel?.length < 5) return;
      // CONTROLLO DELLA LINGUA
      if (ban.guild?.id) {
        let data = await language.databaseCheck(ban.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await ban.guild.channels.fetch(result.guildBanState_channel);
        const fields = [];
        fields.push(
          { name: `${language_result.guildBanRemove.ban_user}`, value: `${ban.user}`, inline: true },
          { name: `${language_result.guildBanRemove.ban_user_id}`, value: `${ban.user.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.guildBanRemove.ban_username}`, value: `${ban.user.username}`, inline: true }
        );

        if (ban.user.bot) {
          fields.push({ name: `${language_result.guildBanRemove.ban_bot_embed}`, value: `${language_result.guildBanRemove.ban_bot_response}`, inline: true });
        }

        if (ban.reason) {
          fields.push({ name: `${language_result.guildBanRemove.ban_reason_embed}`, value: `${ban.reason}` });
        }
        else {
          fields.push({ name: ` `, value: ` ` });
        }

        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.guildBanRemove.ban_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${language_result.guildBanRemove.ban_footer}`, iconURL: `${language_result.guildBanRemove.ban_icon_url}` })
          .setDescription(language_result.guildBanRemove.ban_remove)
          .setColor(0x368c29);
        if (ban.user.avatar) {
          embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${ban.user.id}/${ban.user.avatar}.png`);
        }
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, ban.guil.client, ban.guild, "\\logs_system\\GuildBanRemove.js");
    }
  },
};