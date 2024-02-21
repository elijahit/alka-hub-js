const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync, read } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT emojiState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.GuildEmojiDelete,
  async execute(emoji) {
    let customEmoji = await getEmojifromUrl(emoji.client, "delete");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const result_Db = await readDb(sqlEnabledFeature, emoji.guild.id);
    if (!result_Db) return;
    if (result_Db.logSystem_enabled != 1) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    const result = await readDb(sqlChannelId_log, emoji.guild.id);
    try {

      if (!result?.emojiState_channel) return;
      if (result.emojiState_channel?.length < 5) return;
      // CONTROLLO DELLA LINGUA
      if (emoji.guild?.id) {
        let data = await language.databaseCheck(emoji.guild.id);
        const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await emoji.guild.channels.fetch(result.emojiState_channel);
        const fields = [];

        fields.push(
          { name: `${language_result.emojiDelete.emoji_name}`, value: `${emoji.name}`, inline: true },
          { name: `${language_result.emojiDelete.emoji_id}`, value: `${emoji.id}`, inline: true }
        );

        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.emojiDelete.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${language_result.emojiDelete.embed_footer}`, iconURL: `${language_result.emojiDelete.embed_icon_url}` })
          .setDescription(language_result.emojiDelete.emoji_delete)
          .setColor(0x80131e);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, emoji.client, emoji.guild, "\\logs_system\\EmojiDelete.js");
    }
  },
};