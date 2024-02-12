const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');
const { errorSendControls } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT other_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT otherLogs_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.ChannelCreate,
  async execute(channel) {
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.db.get(sqlEnabledFeature, [channel.guild.id], (_, result_Db) => {
      if (!result_Db) return;
      if (result_Db.otherLogs_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.db.get(sqlChannelId_log, [channel.guild.id], (_, result) => {
        if (result.other_channel.length < 5) return;
        // CONTROLLO DELLA LINGUA
        if (channel.guild?.id) {
          language.databaseCheck(channel.guild.id)
            .then(data => {
              const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
              const language_result = JSON.parse(langagues_path);

              channel.guild.channels.fetch(result.other_channel)
              .then(channel_logs => {
                  // SE VIENE CREATO UN CANALE TESTUALE
                  if (channel.type == 0) {
                    if(channel.parentId != null) {
                      const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                      .addFields(
                        { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                        {name: " ", value: " "},
                        { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true },
                        { name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.url}`, inline: true })         
                        .setDescription(language_result.channelCreate.created_channel)
                        .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                        .setColor(0x318f22);
                        channel_logs.send({ embeds: [embedLog] });
                    } else {
                      const embedLog = new EmbedBuilder()
                        .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                        .addFields(
                          { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}` })
                        .setDescription(language_result.channelCreate.created_channel)
                        .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                        .setColor(0x318f22);
                      channel_logs.send({ embeds: [embedLog] });
                    }
                  }
                  // SE VIENE CREATO UN CANALE VOCALE
                  else if (channel.type == 2) {
                    if(channel.parentId != null) {
                      const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                      .addFields(
                        { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                        {name: " ", value: " "},
                        { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true },
                        { name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.url}`, inline: true })         
                        .setDescription(language_result.channelCreate.created_channel_voice)
                        .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                        .setColor(0x318f22);
                        channel_logs.send({ embeds: [embedLog] });
                    } else {
                      const embedLog = new EmbedBuilder()
                        .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                        .addFields(
                          { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}` })
                        .setDescription(language_result.channelCreate.created_channel_voice)
                        .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                        .setColor(0x318f22);
                      channel_logs.send({ embeds: [embedLog] });
                    }
                  }
                  // SE VIENE CREATA UNA CATEGORIA
                  else if (channel.type == 4) {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                      .addFields(
                        { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                        { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}` })
                      .setDescription(language_result.channelCreate.created_category)
                      .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                      .setColor(0x318f22);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                  // SE VIENE CREATO UN FORUM
                  if (channel.type == 15) {
                    if(channel.parentId != null) {
                      const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                      .addFields(
                        { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                        {name: " ", value: " "},
                        { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true },
                        { name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.url}`, inline: true })         
                        .setDescription(language_result.channelCreate.created_forum)
                        .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                        .setColor(0x318f22);
                        channel_logs.send({ embeds: [embedLog] });
                    } else {
                      const embedLog = new EmbedBuilder()
                        .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                        .addFields(
                          { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}` })
                        .setDescription(language_result.channelCreate.created_forum)
                        .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                        .setColor(0x318f22);
                      channel_logs.send({ embeds: [embedLog] });
                    }
                  }
                  // SE VIENE CREATO UN CANALE MEDIA
                  else if (channel.type == 16) {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                      .addFields(
                        { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                        { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}` })
                      .setDescription(language_result.channelCreate.created_media)
                      .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                      .setColor(0x318f22);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                  // SE VIENE CREATO UN CANALE THREAD PRIVATO
                  else if (channel.type == 12) {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                      .addFields(
                        { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                        { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}` })
                      .setDescription(language_result.channelCreate.created_private_thread)
                      .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                      .setColor(0x318f22);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                  // SE VIENE CREATO UN CANALE THREAD PUBBLICO
                  else if (channel.type == 11) {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                      .addFields(
                        { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                        { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}` })
                      .setDescription(language_result.channelCreate.created_public_thread)
                      .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                      .setColor(0x318f22);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                  // SE VIENE CREATO UN CANALE STAGE
                  if (channel.type == 13) {
                    if(channel.parentId != null) {
                      const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                      .addFields(
                        { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                        {name: " ", value: " "},
                        { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true },
                        { name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.url}`, inline: true })         
                        .setDescription(language_result.channelCreate.created_stage)
                        .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                        .setColor(0x318f22);
                        channel_logs.send({ embeds: [embedLog] });
                    } else {
                      const embedLog = new EmbedBuilder()
                        .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                        .addFields(
                          { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}` })
                        .setDescription(language_result.channelCreate.created_stage)
                        .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                        .setColor(0x318f22);
                      channel_logs.send({ embeds: [embedLog] });
                    }
                  }
                  // SE VIENE CREATO UN CANALE DI ANNUNCI
                  if (channel.type == 5) {
                    if(channel.parentId != null) {
                      const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                      .addFields(
                        { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                        {name: " ", value: " "},
                        { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true },
                        { name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.url}`, inline: true })         
                        .setDescription(language_result.channelCreate.created_announce)
                        .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                        .setColor(0x318f22);
                        channel_logs.send({ embeds: [embedLog] });
                    } else {
                      const embedLog = new EmbedBuilder()
                        .setAuthor({ name: `${language_result.channelCreate.embed_title}` })
                        .addFields(
                          { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
                          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
                          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}` })
                        .setDescription(language_result.channelCreate.created_announce)
                        .setFooter({text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}`})
                        .setColor(0x318f22);
                      channel_logs.send({ embeds: [embedLog] });
                    }
                  }
                })
                .catch((error) => {
                  errorSendControls(error, channel.client, channel.guild, "\\logs_system\\ChannelCreate.js");
                });
            });
        }
      });
    });
  },
};