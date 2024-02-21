const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync, read } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT messageState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    let customEmoji = await getEmojifromUrl(oldMessage.client, "update");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const result_Db = await readDb(sqlEnabledFeature, oldMessage.guild.id);
    if (!result_Db) return;
    if (result_Db.logSystem_enabled != 1) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    const result = await readDb(sqlChannelId_log, oldMessage.guild.id);
    try {

      if (!result?.messageState_channel) return;
      if (result.messageState_channel?.length < 5) return;
      // CONTROLLO DELLA LINGUA
      if (oldMessage.guild?.id) {
        let data = await language.databaseCheck(oldMessage.guild.id);
        const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await oldMessage.guild.channels.fetch(result.messageState_channel);
        const fields = [];

        fields.push(
          { name: `${language_result.messageUpdate.channel_message}`, value: `${oldMessage.channel}`, inline: true },
          { name: `${language_result.messageUpdate.channel_message_id}`, value: `${oldMessage.channelId}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.messageUpdate.author_message}`, value: `${oldMessage.author}`, inline: true },
          { name: `${language_result.messageUpdate.author_message_id}`, value: `${oldMessage.author.id}`, inline: true },
          { name: " ", value: " " }
        );

        const embedLog = new EmbedBuilder();
        if (oldMessage.content && !newMessage.content) {
          embedLog
            .setDescription(`**${language_result.messageUpdate.embed_description}:**\n${oldMessage.content}`);
        } else if (!oldMessage.content && newMessage.content) {
          embedLog
            .setDescription(`**${language_result.messageUpdate.embed_description_new}:**\n${newMessage.content}`);
        } else if (oldMessage.content && newMessage.content) {
          embedLog
            .setDescription(`**${language_result.messageUpdate.embed_description}:**\n${oldMessage.content}\n**${language_result.messageUpdate.embed_description_new}:**\n${newMessage.content}`);
        }

        if (oldMessage.attachments.size > 0) {
          let attachmentsContainer = "";
          await oldMessage.attachments.each(value => {
            attachmentsContainer += `${value.url}\n`;
          });
          fields.push({ name: `${language_result.messageUpdate.attachments_message}`, value: `${attachmentsContainer}` });
        }
        fields.push({ name: `${language_result.messageUpdate.go_message}`, value: `${oldMessage.url}` })

        embedLog
          .setAuthor({ name: `${language_result.messageUpdate.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${language_result.messageUpdate.embed_footer}`, iconURL: `${language_result.messageUpdate.embed_icon_url}` })
          .setColor(0xfcba03);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, oldMessage.client, oldMessage.guild, "\\logs_system\\MessageUpdate.js");
    }
  },
};