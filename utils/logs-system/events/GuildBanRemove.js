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
  name: Events.GuildBanRemove,
  async execute(ban) {
    let customEmoji = emoji.banSystem.unBanMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, ban.guild.id);
    if (!resultDb) return;
    if (resultDb["is_enabled"] != 1) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      if (!resultDb["ban_state_channel"]) return;
      // CONTROLLO DELLA LINGUA
      if (ban.guild?.id) {
        let data = await language.databaseCheck(ban.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await ban.guild.channels.fetch(resultDb["ban_state_channel"]);
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
          .setColor(colors.general.success);
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