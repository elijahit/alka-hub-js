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
  name: Events.GuildEmojiUpdate,
  async execute(oldEmoji, newEmoji) {
    let customEmoji = emoji.general.updateMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, oldEmoji.guild.id);
    if (!resultDb) return;
    if (resultDb["is_enabled"] != 1) return;
    if (!resultDb["emoji_state_channel"]) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (oldEmoji.guild?.id) {
        let data = await language.databaseCheck(oldEmoji.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await oldEmoji.guild.channels.fetch(resultDb["emoji_state_channel"]);
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
          .setColor(colors.general.aquamarine);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      console.log(error)
      errorSendControls(error, oldEmoji.client, oldEmoji.guild, "\\logs_system\\EmojiUpdate.js");
    }
  },
};