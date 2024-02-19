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
  name: Events.MessageReactionRemoveAll,
  async execute(message, reactions) {
    let customEmoji = await getEmojifromUrl(message.client, "reactionremoveall");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.getValueDatabase(sqlEnabledFeature, message.guild.id, (result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.getValueDatabase(sqlChannelId_log, message.guild.id, async (result) => {
        try {

          if (!result?.messageState_channel) return;
          if (result.messageState_channel?.length < 5) return;
          if (message.author == message.client.user) return;
          // CONTROLLO DELLA LINGUA
          if (message.guild?.id) {
            let data = await language.databaseCheck(message.guild.id);
            const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
            const language_result = JSON.parse(langagues_path);
  
            let channel_logs = await message.guild.channels.fetch(result.messageState_channel);
            const fields = [];
            
            fields.push(
              {name: `${language_result.messageReactionRemoveAll.message_channel}`, value: `${message.channel}`, inline: true},
              {name: `${language_result.messageReactionRemoveAll.message_channel_id}`, value: `${message.channel.id}`, inline: true},
              {name: " ", value: " "},
              {name: `${language_result.messageReactionRemoveAll.message_embed}`, value: `${message.url}`, inline: true},
              {name: `${language_result.messageReactionRemoveAll.message_embed_id}`, value: `${message.id}`, inline: true}
            );
            let reactionsContainer = "";
            await reactions.each(reaction => {
              reactionsContainer += `> ${reaction._emoji} (${reaction.count})\n`;
            })

            fields.push({name: `${language_result.messageReactionRemoveAll.embed_reactions}`, value: `${reactionsContainer}`});
            
            const embedLog = new EmbedBuilder();
            embedLog
              .setAuthor({ name: `${language_result.messageReactionRemoveAll.embed_title}`, iconURL: customEmoji })
              .addFields(fields)
              .setDescription(language_result.messageReactionRemoveAll.embed_description)
              .setFooter({ text: `${language_result.messageReactionRemoveAll.embed_footer}`, iconURL: `${language_result.messageReactionRemoveAll.embed_icon_url}` })
              .setColor(0x34ebeb);
            channel_logs.send({ embeds: [embedLog] });
          }
        }
        catch (error) {
          errorSendControls(error, message.client, message.guild, "\\logs_system\\MessageReactionRemoveAll.js");
        }
      });
    });
  },
};