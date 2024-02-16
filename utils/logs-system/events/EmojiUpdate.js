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
  name: Events.GuildEmojiUpdate,
  async execute(oldEmoji, newEmoji) {
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.db.get(sqlEnabledFeature, [oldEmoji.guild.id], (_, result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.db.get(sqlChannelId_log, [oldEmoji.guild.id], (_, result) => {
        if (!result?.emojiState_channel) return;
        if (result.emojiState_channel?.length < 5) return;
        // CONTROLLO DELLA LINGUA
        if (oldEmoji.guild?.id) {
          language.databaseCheck(oldEmoji.guild.id)
            .then(data => {
              const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
              const language_result = JSON.parse(langagues_path);

              oldEmoji.guild.channels.fetch(result.emojiState_channel)
                .then(channel_logs => {
                  const fields = [];
                  
                  // CONTROLLO EMOJI ANIMATA O NO
                  let animatedEmoji, avaliableEmoji;
                  switch(oldEmoji.animated) {
                    case true:
                      animatedEmoji = language_result.emojiUpdate.emoji_animated;
                      break;
                    case false:
                      animatedEmoji = language_result.emojiUpdate.emoji_not_animated;
                  }

                  // CONTROLLO EMOJI DISPONIBILE O NO
                  switch(oldEmoji.available) {
                    case true:
                      avaliableEmoji = language_result.emojiUpdate.emoji_avaliable;
                      break;
                    case false:
                      avaliableEmoji = language_result.emojiUpdate.emoji_not_avaliable;
                  }

                  fields.push(
                    {name: `${language_result.emojiUpdate.emoji_name_old}`, value: `${oldEmoji.name}`, inline: true},
                    {name: `${language_result.emojiUpdate.emoji_name_new}`, value: `${newEmoji.name}`, inline: true},
                    {name: `${language_result.emojiUpdate.emoji_id}`, value: `${oldEmoji.id}`, inline: false},
                    {name: ` `, value: ` `},
                    {name: `${language_result.emojiUpdate.emoji_state}`, value: `${animatedEmoji}`, inline: true},
                    {name: `${language_result.emojiUpdate.emoji_state_avaliable}`, value: `${avaliableEmoji}`, inline: true}
                  );
                  
                  oldEmoji.guild.emojis.fetch(oldEmoji.id)
                    .then(emoji => {
                      fields.push({name: " ", value: `${language_result.emojiUpdate.emoji_rappresentative}: ${emoji}`});
                    })
                    .catch((error) => {
                      errorSendControls(error, oldEmoji.client, oldEmoji.guild, "\\logs_system\\EmojiUpdate.js");
                    });

                  setTimeout(() => {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.emojiUpdate.embed_title}` })
                      .addFields(fields)
                      .setFooter({ text: `${language_result.emojiUpdate.embed_footer}`, iconURL: `${language_result.emojiUpdate.embed_icon_url}` })
                      .setDescription(language_result.emojiUpdate.emoji_create)
                      .setColor(0x1c7872);
                    channel_logs.send({ embeds: [embedLog] })
                      .catch(() => {
                        return;
                      });
                  }, 2000);
                })
                .catch((error) => {
                  return;
                });
            })
            .catch((error) => {
              errorSendControls(error, oldEmoji.client, oldEmoji.guild, "\\logs_system\\EmojiUpdate.js");
            });
        }
      });
    });
  },
};