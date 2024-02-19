const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT messageState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    let customEmoji = await getEmojifromUrl(message.client, "delete");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.getValueDatabase(sqlEnabledFeature, message.guild.id, (result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.getValueDatabase(sqlChannelId_log, message.guild.id, async (result) => {
        // try {

          if (!result?.messageState_channel) return;
          if (result.messageState_channel?.length < 5) return;
          // CONTROLLO DELLA LINGUA
          if (message.guild?.id) {
            let data = await language.databaseCheck(message.guild.id);
            const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
            const language_result = JSON.parse(langagues_path);
  
            let channel_logs = await message.guild.channels.fetch(result.messageState_channel);
            const fields = [];

            fields.push(
              {name: `${language_result.messageDelete.channel_message}`, value: `${message.channel}`, inline: true},
              {name: `${language_result.messageDelete.channel_message_id}`, value: `${message.channelId}`, inline: true},
              {name: " ", value: " "},
              {name: `${language_result.messageDelete.author_message}`, value: `${message.author}`, inline: true},
              {name: `${language_result.messageDelete.author_message_id}`, value: `${message.author.id}`, inline: true},
              {name: " ", value: " "}
            );

            const embedLog = new EmbedBuilder();
            if(message.content) {
              embedLog
              .setDescription(`**${language_result.messageDelete.embed_description}:**\n${message.content}`);
            }

            if(message.attachments.size > 0) {
              let attachmentsContainer = "";
              await message.attachments.each(value => {
                attachmentsContainer += `${value.url}\n`;
              });
              fields.push({name: `${language_result.messageDelete.attachments_message}`, value: `${attachmentsContainer}`});
            }
            embedLog
              .setAuthor({ name: `${language_result.messageDelete.embed_title}`, iconURL: customEmoji })
              .addFields(fields)
              .setFooter({ text: `${language_result.messageDelete.embed_footer}`, iconURL: `${language_result.messageDelete.embed_icon_url}` })
              .setColor(0x80131e);
            channel_logs.send({ embeds: [embedLog] });
          }
        // }
        // catch (error) {
        //   errorSendControls(error, message.client, message.guild, "\\logs_system\\MessageDelete.js");
        // }
      });
    });
  },
};