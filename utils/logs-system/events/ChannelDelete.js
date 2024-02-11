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
  name: Events.ChannelDelete,
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
                 // SE VIENE CANCELLATO UN CANALE TESTUALE
                 if (channel.type == 0) {
                  if(channel.parentId != null) {
                    const embedLog = new EmbedBuilder()
                    .setAuthor({ name: "Alka Hub | Logs System 💨" })
                    .addFields(
                      { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                      { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true },
                      {name: " ", value: " "},
                      { name: `${language_result.channelDeleted.category_channel}`, value: `${channel.parent.url}`, inline: true })         
                      .setDescription(language_result.channelDeleted.deleted_channel)
                      .setColor(0x80131e);
                      channel_logs.send({ embeds: [embedLog] });
                  } else {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: "Alka Hub | Logs System 💨" })
                      .addFields(
                        { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true })
                      .setDescription(language_result.channelDeleted.deleted_channel)
                      .setColor(0x80131e);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                }
                // SE VIENE CANCELLATO UN CANALE VOCALE
                else if (channel.type == 2) {
                  if(channel.parentId != null) {
                    const embedLog = new EmbedBuilder()
                    .setAuthor({ name: "Alka Hub | Logs System 💨" })
                    .addFields(
                      { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                      { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true },
                      {name: " ", value: " "},
                      { name: `${language_result.channelDeleted.category_channel}`, value: `${channel.parent.url}`, inline: true })         
                      .setDescription(language_result.channelDeleted.deleted_channel_voice)
                      .setColor(0x80131e);
                      channel_logs.send({ embeds: [embedLog] });
                  } else {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: "Alka Hub | Logs System 💨" })
                      .addFields(
                        { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true })
                      .setDescription(language_result.channelDeleted.deleted_channel_voice)
                      .setColor(0x80131e);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                }
                // SE VIENE CANCELLATA UNA CATEGORIA
                else if (channel.type == 4) {
                  const embedLog = new EmbedBuilder()
                    .setAuthor({ name: "Alka Hub | Logs System 💨" })
                    .addFields(
                      { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                      { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true })
                    .setDescription(language_result.channelDeleted.deleted_category)
                    .setColor(0x80131e);
                  channel_logs.send({ embeds: [embedLog] });
                }
                // SE VIENE CANCELLATO UN FORUM
                if (channel.type == 15) {
                  if(channel.parentId != null) {
                    const embedLog = new EmbedBuilder()
                    .setAuthor({ name: "Alka Hub | Logs System 💨" })
                    .addFields(
                      { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                      { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true },
                      {name: " ", value: " "},
                      { name: `${language_result.channelDeleted.category_channel}`, value: `${channel.parent.url}`, inline: true })         
                      .setDescription(language_result.channelDeleted.deleted_forum)
                      .setColor(0x80131e);
                      channel_logs.send({ embeds: [embedLog] });
                  } else {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: "Alka Hub | Logs System 💨" })
                      .addFields(
                        { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true })
                      .setDescription(language_result.channelDeleted.deleted_forum)
                      .setColor(0x80131e);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                }
                // SE VIENE CANCELLATO UN CANALE MEDIA
                else if (channel.type == 16) {
                  const embedLog = new EmbedBuilder()
                    .setAuthor({ name: "Alka Hub | Logs System 💨" })
                    .addFields(
                      { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                      { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true })
                    .setDescription(language_result.channelDeleted.deleted_media)
                    .setColor(0x80131e);
                  channel_logs.send({ embeds: [embedLog] });
                }
                // SE VIENE CANCELLATO UN CANALE THREAD PRIVATO
                else if (channel.type == 12) {
                  const embedLog = new EmbedBuilder()
                    .setAuthor({ name: "Alka Hub | Logs System 💨" })
                    .addFields(
                      { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                      { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true })
                    .setDescription(language_result.channelDeleted.deleted_private_thread)
                    .setColor(0x80131e);
                  channel_logs.send({ embeds: [embedLog] });
                }
                // SE VIENE CANCELLATO UN CANALE THREAD PUBBLICO
                else if (channel.type == 11) {
                  const embedLog = new EmbedBuilder()
                    .setAuthor({ name: "Alka Hub | Logs System 💨" })
                    .addFields(
                      { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                      { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true })
                    .setDescription(language_result.channelDeleted.deleted_public_thread)
                    .setColor(0x80131e);
                  channel_logs.send({ embeds: [embedLog] });
                }
                // SE VIENE CANCELLATO UN CANALE STAGE
                if (channel.type == 13) {
                  if(channel.parentId != null) {
                    const embedLog = new EmbedBuilder()
                    .setAuthor({ name: "Alka Hub | Logs System 💨" })
                    .addFields(
                      { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                      { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true },
                      {name: " ", value: " "},
                      { name: `${language_result.channelDeleted.category_channel}`, value: `${channel.parent.url}`, inline: true })         
                      .setDescription(language_result.channelDeleted.deleted_stage)
                      .setColor(0x80131e);
                      channel_logs.send({ embeds: [embedLog] });
                  } else {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: "Alka Hub | Logs System 💨" })
                      .addFields(
                        { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true })
                      .setDescription(language_result.channelDeleted.deleted_stage)
                      .setColor(0x80131e);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                }
                // SE VIENE CANCELLATO UN CANALE DI ANNUNCI
                if (channel.type == 5) {
                  if(channel.parentId != null) {
                    const embedLog = new EmbedBuilder()
                    .setAuthor({ name: "Alka Hub | Logs System 💨" })
                    .addFields(
                      { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                      { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true },
                      {name: " ", value: " "},
                      { name: `${language_result.channelDeleted.category_channel}`, value: `${channel.parent.url}`, inline: true })         
                      .setDescription(language_result.channelDeleted.deleted_announce)
                      .setColor(0x80131e);
                      channel_logs.send({ embeds: [embedLog] });
                  } else {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: "Alka Hub | Logs System 💨" })
                      .addFields(
                        { name: `${language_result.channelDeleted.name_channel}`, value: `${channel.name}`, inline: true },
                        { name: `${language_result.channelDeleted.id_channel}`, value: `${channel.id}`, inline: true })
                      .setDescription(language_result.channelDeleted.deleted_announce)
                      .setColor(0x80131e);
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