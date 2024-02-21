const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT emojiState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.GuildEmojiUpdate,
  async execute(oldEmoji, newEmoji) {
    let customEmoji = await getEmojifromUrl(oldEmoji.client, "update");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const result_Db = await readDb(sqlEnabledFeature, oldEmoji.guild.id);
    if (!result_Db) return;
    if (result_Db.logSystem_enabled != 1) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    const result = await readDb(sqlChannelId_log, oldEmoji.guild.id);
    try {

      if (!result?.emojiState_channel) return;
      if (result.emojiState_channel?.length < 5) return;
      // CONTROLLO DELLA LINGUA
      if (oldEmoji.guild?.id) {
        let data = await language.databaseCheck(oldEmoji.guild.id);
        const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await oldEmoji.guild.channels.fetch(result.emojiState_channel);
        const fields = [];

        // CONTROLLO EMOJI ANIMATA O NO
        let animatedEmoji, avaliableEmoji;
        switch (oldEmoji.animated) {
          case true:
            animatedEmoji = language_result.emojiUpdate.emoji_animated;
            break;
          case false:
            animatedEmoji = language_result.emojiUpdate.emoji_not_animated;
        }

        // CONTROLLO EMOJI DISPONIBILE O NO
        switch (oldEmoji.available) {
          case true:
            avaliableEmoji = language_result.emojiUpdate.emoji_avaliable;
            break;
          case false:
            avaliableEmoji = language_result.emojiUpdate.emoji_not_avaliable;
        }

        fields.push(
          { name: `${language_result.emojiUpdate.emoji_name_old}`, value: `${oldEmoji.name}`, inline: true },
          { name: `${language_result.emojiUpdate.emoji_name_new}`, value: `${newEmoji.name}`, inline: true },
          { name: `${language_result.emojiUpdate.emoji_id}`, value: `${oldEmoji.id}`, inline: false },
          { name: ` `, value: ` ` },
          { name: `${language_result.emojiUpdate.emoji_state}`, value: `${animatedEmoji}`, inline: true },
          { name: `${language_result.emojiUpdate.emoji_state_avaliable}`, value: `${avaliableEmoji}`, inline: true }
        );

        const emoji = await oldEmoji.guild.emojis.fetch(oldEmoji.id)
        fields.push({ name: " ", value: `${language_result.emojiUpdate.emoji_rappresentative}: ${emoji}` });

        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.emojiUpdate.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${language_result.emojiUpdate.embed_footer}`, iconURL: `${language_result.emojiUpdate.embed_icon_url}` })
          .setDescription(language_result.emojiUpdate.emoji_update)
          .setColor(0x1c7872);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      console.log(error)
      errorSendControls(error, oldEmoji.client, oldEmoji.guild, "\\logs_system\\EmojiUpdate.js");
    }
  },
};