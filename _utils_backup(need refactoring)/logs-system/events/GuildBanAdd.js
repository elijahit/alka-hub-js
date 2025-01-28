const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const {readDb} = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

// QUERY DEFINITION
let sql = `SELECT * FROM logs_system WHERE guilds_id = ?`;
// ------------ //

module.exports = {
  name: Events.GuildBanAdd,
  async execute(ban) {
    let customEmoji = emoji.logsSystem.banMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, ban.guild.id);
    if (!resultDb) return;
    if (!await checkFeaturesIsEnabled(ban.guild, 1)) return;
    if (!resultDb["ban_state_channel"]) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (ban.guild?.id) {
        let data = await language.databaseCheck(ban.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await ban.guild.channels.fetch(resultDb["ban_state_channel"]);
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
          .setColor(colors.general.error);
        if (ban.user.avatar) {
          embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${ban.user.id}/${ban.user.avatar}.png`);
        }
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, ban.client, ban.guild, "\\logs_system\\GuildBanAdd.js");
    }
  },
};