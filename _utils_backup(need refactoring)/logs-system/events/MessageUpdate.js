const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync, read } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

// QUERY DEFINITION
let sql = `SELECT * FROM logs_system WHERE guilds_id = ?`;
// ------------ //

module.exports = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    let customEmoji = emoji.general.updateMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, oldMessage.guild.id);
    if (!resultDb) return;
    if (!await checkFeaturesIsEnabled(oldMessage.guild, 1)) return;
    if (!resultDb["message_state_channel"]) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      if(oldMessage.author.id == oldMessage.client.user.id) return;
      // CONTROLLO DELLA LINGUA
      if (oldMessage.guild?.id) {
        let data = await language.databaseCheck(oldMessage.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await oldMessage.guild.channels.fetch(resultDb["message_state_channel"]);
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
          .setColor(colors.general.danger);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, oldMessage.client, oldMessage.guild, "\\logs_system\\MessageUpdate.js");
    }
  },
};