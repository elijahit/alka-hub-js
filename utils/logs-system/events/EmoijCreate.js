const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');
const { errorSendControls } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT emojiState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.GuildEmojiCreate,
  async execute(emoji) {
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.db.get(sqlEnabledFeature, [emoji.guild.id], (_, result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.db.get(sqlChannelId_log, [emoji.guild.id], (_, result) => {
        if (!result?.emojiState_channel) return;
        if (result.emojiState_channel?.length < 5) return;
        // CONTROLLO DELLA LINGUA
        if (emoji.guild?.id) {
          language.databaseCheck(emoji.guild.id)
            .then(data => {
              const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
              const language_result = JSON.parse(langagues_path);

              emoji.guild.channels.fetch(result.emojiState_channel)
                .then(channel_logs => {
                  const fields = [];

                  // CONTROLLO EMOJI ANIMATA O NO
                  let animatedEmoji, avaliableEmoji;
                  switch(emoji.animated) {
                    case true:
                      animatedEmoji = language_result.emojiCreate.emoji_animated;
                      break;
                    case false:
                      animatedEmoji = language_result.emojiCreate.emoji_not_animated;
                  }

                  // CONTROLLO EMOJI DISPONIBILE O NO
                  switch(emoji.available) {
                    case true:
                      avaliableEmoji = language_result.emojiCreate.emoji_avaliable;
                      break;
                    case false:
                      avaliableEmoji = language_result.emojiCreate.emoji_not_avaliable;
                  }

                  fields.push(
                    {name: `${language_result.emojiCreate.emoji_name}`, value: `${emoji.name}`, inline: true},
                    {name: `${language_result.emojiCreate.emoji_id}`, value: `${emoji.id}`, inline: true},
                    {name: ` `, value: ` `},
                    {name: `${language_result.emojiCreate.emoji_state}`, value: `${animatedEmoji}`, inline: true},
                    {name: `${language_result.emojiCreate.emoji_state_avaliable}`, value: `${avaliableEmoji}`, inline: true}
                    );
                  
                    emoji.guild.emojis.fetch(emoji.id)
                    .then(emojis => {
                      fields.push({name: " ", value: `${language_result.emojiCreate.emoji_rappresentative}: ${emojis}`});
                    })
                    .catch((error) => {
                      errorSendControls(error, oldEmoji.client, oldEmoji.guild, "\\logs_system\\EmojiCreate.js");
                    });

                  setTimeout(() => {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.emojiCreate.embed_title}` })
                      .addFields(fields)
                      .setFooter({ text: `${language_result.emojiCreate.embed_footer}`, iconURL: `${language_result.emojiCreate.embed_icon_url}` })
                      .setDescription(language_result.emojiCreate.emoji_create)
                      .setColor(0xfcba03);
                    channel_logs.send({ embeds: [embedLog] });
                  }, 2000);
                })
                .catch((error) => {
                 // vai avanti
                });
            })
            .catch((error) => {
              errorSendControls(error, emoji.client, emoji.guild, "\\logs_system\\EmojiCreate.js");
            });
        }
      });
    });
  },
};