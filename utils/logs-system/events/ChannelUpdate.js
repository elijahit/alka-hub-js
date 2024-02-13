const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');
const { errorSendControls } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT channelState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.ChannelUpdate,
  async execute(oldChannel, newChannel) {
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.db.get(sqlEnabledFeature, [oldChannel.guild.id], (_, result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.db.get(sqlChannelId_log, [oldChannel.guild.id], (_, result) => {
        if (result.channelState_channel?.length < 5) return;
        // CONTROLLO DELLA LINGUA
        if (oldChannel.guild?.id) {
          language.databaseCheck(oldChannel.guild.id)
            .then(data => {
              const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
              const language_result = JSON.parse(langagues_path);

              oldChannel.guild.channels.fetch(result.channelState_channel)
                .then(channel_logs => {
                  // SE IL NOME DI UN CANALE VIENE CAMBIATO
                  if (oldChannel.name != newChannel.name) {
                    const fields = [{ name: `${language_result.channelUpdate.old_name}`, value: `${oldChannel.name}`, inline: true },
                    { name: `${language_result.channelUpdate.new_name}`, value: `${newChannel.name}`, inline: true },
                    {name: " ", value: " "},
                    {name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}`},
                    {name: " ", value: " "},
                    { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true }];
                    if (oldChannel.parentId) {
                      fields.push({ name: `${language_result.channelUpdate.category_channel}`, value: `${newChannel.parent.name}`, inline: true });
                    }

                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                      .addFields(fields)         
                      .setDescription(language_result.channelUpdate.name_change_embed)
                      .setFooter({text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}`})
                      .setColor(0xebb734);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                  // SE LA CATEGORIA DI UN CANALE VIENE CAMBIATA
                  if(oldChannel.parentId != newChannel.parentId) {
                    const fields = [];
                    if(oldChannel.parentId) {
                      fields.push({name: `${language_result.channelUpdate.old_category}`, value: `${oldChannel.parent.name}`, inline: true }); 
                    }
                    else {
                      fields.push({name: `${language_result.channelUpdate.old_category}`, value: `${language_result.channelUpdate.empty_category}`, inline: true }); 
                    }
                    if (newChannel.parentId) {
                      fields.push({ name: `${language_result.channelUpdate.new_category}`, value: `${newChannel.parent.name}`, inline: true });
                    } else {
                      fields.push({ name: `${language_result.channelUpdate.new_category}`, value: `${language_result.channelUpdate.empty_category}`, inline: true });
                    }
                    fields.push({name: " ", value: " "},
                    {name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}`},
                    {name: " ", value: " "},
                    { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true })

                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                      .addFields(fields)         
                      .setDescription(language_result.channelUpdate.category_change_embed)
                      .setFooter({text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}`})
                      .setColor(0xebb734);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                  // SE IL BITRATE VIENE CAMBIATO
                  if (oldChannel.bitrate != newChannel.bitrate) {
                    const fields = [{ name: `${language_result.channelUpdate.old_bitrate}`, value: `${oldChannel.bitrate}`, inline: true },
                    { name: `${language_result.channelUpdate.new_bitrate}`, value: `${newChannel.bitrate}`, inline: true },
                    {name: " ", value: " "},
                    {name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}`},
                    {name: " ", value: " "},
                    { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true }];
                    if (oldChannel.parentId) {
                      fields.push({ name: `${language_result.channelUpdate.category_channel}`, value: `${newChannel.parent.name}`, inline: true });
                    }

                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                      .addFields(fields)         
                      .setDescription(language_result.channelUpdate.bitrate_change_embed)
                      .setFooter({text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}`})
                      .setColor(0xebb734);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                  // SE IL LIMITE DEGLI UTENTI VIENE CAMBIATO
                  if (oldChannel.userLimit != newChannel.userLimit) {
                    const fields = [{ name: `${language_result.channelUpdate.old_userlimit}`, value: `${oldChannel.userLimit}`, inline: true },
                    { name: `${language_result.channelUpdate.new_userlimit}`, value: `${newChannel.userLimit}`, inline: true },
                    {name: " ", value: " "},
                    {name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}`},
                    {name: " ", value: " "},
                    { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true }];
                    if (oldChannel.parentId) {
                      fields.push({ name: `${language_result.channelUpdate.category_channel}`, value: `${newChannel.parent.name}`, inline: true });
                    }

                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                      .addFields(fields)         
                      .setDescription(language_result.channelUpdate.userlimit_change_embed)
                      .setFooter({text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}`})
                      .setColor(0xebb734);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                })
                .catch((error) => {
                  errorSendControls(error, oldChannel.client, oldChannel.guild, "\\logs_system\\ChannelCreate.js");
                });
            });
        }
      });
    });
  },
};