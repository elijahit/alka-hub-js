const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emojis = require('../../../bin/data/emoji');

// QUERY DEFINITION
let sql = `SELECT * FROM logs_system WHERE guilds_id = ?`;
// ------------ //

module.exports = {
  name: Events.GuildEmojiCreate,
  async execute(emoji) {
    let customEmoji = emojis.general.newMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, emoji.guild.id);
    if (!resultDb) return;
    if (resultDb["is_enabled"] != 1) return;
    if (!resultDb["emoji_state_channel"]) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (emoji.guild?.id) {
        let data = await language.databaseCheck(emoji.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await emoji.guild.channels.fetch(resultDb["emoji_state_channel"]);
        const fields = [];

        // CONTROLLO EMOJI ANIMATA O NO
        let animatedEmoji, avaliableEmoji;
        switch (emoji.animated) {
          case true:
            animatedEmoji = language_result.emojiCreate.emoji_animated;
            break;
          case false:
            animatedEmoji = language_result.emojiCreate.emoji_not_animated;
        }

        // CONTROLLO EMOJI DISPONIBILE O NO
        switch (emoji.available) {
          case true:
            avaliableEmoji = language_result.emojiCreate.emoji_avaliable;
            break;
          case false:
            avaliableEmoji = language_result.emojiCreate.emoji_not_avaliable;
        }

        fields.push(
          { name: `${language_result.emojiCreate.emoji_name}`, value: `${emoji.name}`, inline: true },
          { name: `${language_result.emojiCreate.emoji_id}`, value: `${emoji.id}`, inline: true },
          { name: ` `, value: ` ` },
          { name: `${language_result.emojiCreate.emoji_state}`, value: `${animatedEmoji}`, inline: true },
          { name: `${language_result.emojiCreate.emoji_state_avaliable}`, value: `${avaliableEmoji}`, inline: true }
        );

        let emojis = await emoji.guild.emojis.fetch(emoji.id)
        fields.push({ name: " ", value: `${language_result.emojiCreate.emoji_rappresentative}: ${emojis}` });

        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.emojiCreate.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${language_result.emojiCreate.embed_footer}`, iconURL: `${language_result.emojiCreate.embed_icon_url}` })
          .setDescription(language_result.emojiCreate.emoji_create)
          .setColor(colors.general.danger);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, emoji.client, emoji.guild, "\\logs_system\\EmojiCreate.js");
    }
  },
};