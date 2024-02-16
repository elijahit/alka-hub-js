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
  name: Events.GuildEmojiDelete,
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

                  fields.push(
                    {name: `${language_result.emojiDelete.emoji_name}`, value: `${emoji.name}`, inline: true},
                    {name: `${language_result.emojiDelete.emoji_id}`, value: `${emoji.id}`, inline: true}
                    );
                  
                  setTimeout(() => {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.emojiDelete.embed_title}` })
                      .addFields(fields)
                      .setFooter({ text: `${language_result.emojiDelete.embed_footer}`, iconURL: `${language_result.emojiDelete.embed_icon_url}` })
                      .setDescription(language_result.emojiDelete.emoji_delete)
                      .setColor(0x80131e);
                    channel_logs.send({ embeds: [embedLog] });
                  }, 2000);
                })
                .catch((error) => {
                  //vai avanti
                });
            })
            .catch((error) => {
              errorSendControls(error, emoji.client, emoji.guild, "\\logs_system\\EmojiDelete.js");
            });
        }
      });
    });
  },
};