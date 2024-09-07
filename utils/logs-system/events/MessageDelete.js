const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
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
  name: Events.MessageDelete,
  async execute(message) {
    let customEmoji = emoji.general.deleteMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, message.guild.id);
    if (!resultDb) return;
    if (!await checkFeaturesIsEnabled(message.guild, "is_enabled_logs")) return;
    if (!resultDb["message_state_channel"]) return;
    try {
      // CONTROLLO DELLA LINGUA
      if (message.guild?.id) {
        let data = await language.databaseCheck(message.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await message.guild.channels.fetch(resultDb["message_state_channel"]);
        const fields = [];

        fields.push(
          { name: `${language_result.messageDelete.channel_message}`, value: `${message.channel}`, inline: true },
          { name: `${language_result.messageDelete.channel_message_id}`, value: `${message.channelId}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.messageDelete.author_message}`, value: `${message.author}`, inline: true },
          { name: `${language_result.messageDelete.author_message_id}`, value: `${message.author.id}`, inline: true },
          { name: " ", value: " " }
        );

        const embedLog = new EmbedBuilder();
        if (message.content) {
          embedLog
            .setDescription(`**${language_result.messageDelete.embed_description}:**\n${message.content}`);
        }

        if (message.attachments.size > 0) {
          let attachmentsContainer = "";
          await message.attachments.each(value => {
            attachmentsContainer += `${value.url}\n`;
          });
          fields.push({ name: `${language_result.messageDelete.attachments_message}`, value: `${attachmentsContainer}` });
        }
        embedLog
          .setAuthor({ name: `${language_result.messageDelete.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${language_result.messageDelete.embed_footer}`, iconURL: `${language_result.messageDelete.embed_icon_url}` })
          .setColor(colors.general.error);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, message.client, message.guild, "\\logs_system\\MessageDelete.js");
    }
  },
};