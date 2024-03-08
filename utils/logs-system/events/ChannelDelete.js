const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync, read } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT channelState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.ChannelDelete,
  async execute(channel) {
    let customEmoji = await getEmojifromUrl(channel.client, "delete");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const result_Db = await readDb(sqlEnabledFeature, channel.guild.id);
    if (!result_Db) return;
    if (result_Db.logSystem_enabled != 1) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    const result = await readDb(sqlChannelId_log, channel.guild.id);
    try {
      const channelStatsSystem = await readDbAllWith2Params(`SELECT * FROM stats_system_channel WHERE channelId = ? AND guildId = ?`, channel.id, channel.guild.id);
      if (channelStatsSystem[0]?.channelId) return;
      if (!result?.channelState_channel) return;
      if (result.channelState_channel?.length < 5) return;
      // CONTROLLO DELLA LINGUA
      if (channel.guild?.id) {
        let data = await language.databaseCheck(channel.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await channel.guild.channels.fetch(result.channelState_channel);
        // SE VIENE CANCELLATO UN CANALE TESTUALE
        if (channel.type == 0) {
          const fields = [{ name: `${language_result.channelDelete.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelDelete.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelDelete.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelDelete.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelDelete.deleted_channel)
            .setFooter({ text: `${language_result.channelDelete.embed_footer}`, iconURL: `${language_result.channelDelete.embed_icon_url}` })
            .setColor(0x80131e);
          channel_logs.send({ embeds: [embedLog] })
        }
        // SE VIENE CANCELLATO UN CANALE VOCALE
        else if (channel.type == 2) {
          const fields = [{ name: `${language_result.channelDelete.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelDelete.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelDelete.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelDelete.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelDelete.deleted_channel_voice)
            .setFooter({ text: `${language_result.channelDelete.embed_footer}`, iconURL: `${language_result.channelDelete.embed_icon_url}` })
            .setColor(0x80131e);
          channel_logs.send({ embeds: [embedLog] })
        }
        // SE VIENE CREATA UNA CATEGORIA
        else if (channel.type == 4) {
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelDelete.embed_title}`, iconURL: customEmoji })
            .addFields(
              { name: `${language_result.channelDelete.name_channel}`, value: `${channel.name}`, inline: true },
              { name: `${language_result.channelDelete.id_channel}`, value: `${channel.id}`, inline: true })
            .setDescription(language_result.channelDelete.deleted_category)
            .setFooter({ text: `${language_result.channelDelete.embed_footer}`, iconURL: `${language_result.channelDelete.embed_icon_url}` })
            .setColor(0x80131e);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CANCELLATO UN FORUM
        if (channel.type == 15) {
          const fields = [{ name: `${language_result.channelDelete.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelDelete.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelDelete.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelDelete.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelDelete.deleted_forum)
            .setFooter({ text: `${language_result.channelDelete.embed_footer}`, iconURL: `${language_result.channelDelete.embed_icon_url}` })
            .setColor(0x80131e);
          channel_logs.send({ embeds: [embedLog] })
        }
        // SE VIENE CANCELLATO UN CANALE MEDIA
        else if (channel.type == 16) {
          const fields = [{ name: `${language_result.channelDelete.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelDelete.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelDelete.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelDelete.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelDelete.deleted_media)
            .setFooter({ text: `${language_result.channelDelete.embed_footer}`, iconURL: `${language_result.channelDelete.embed_icon_url}` })
            .setColor(0x80131e);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CANCELLATO UN CANALE THREAD PRIVATO
        else if (channel.type == 12) {
          const fields = [{ name: `${language_result.channelDelete.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelDelete.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelDelete.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelDelete.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelDelete.deleted_private_thread)
            .setFooter({ text: `${language_result.channelDelete.embed_footer}`, iconURL: `${language_result.channelDelete.embed_icon_url}` })
            .setColor(0x80131e);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CANCELLATO UN CANALE THREAD PUBBLICO
        else if (channel.type == 11) {
          const fields = [{ name: `${language_result.channelDelete.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelDelete.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelDelete.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelDelete.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelDelete.deleted_public_thread)
            .setFooter({ text: `${language_result.channelDelete.embed_footer}`, iconURL: `${language_result.channelDelete.embed_icon_url}` })
            .setColor(0x80131e);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CANCELLATO UN CANALE STAGE
        if (channel.type == 13) {
          const fields = [{ name: `${language_result.channelDelete.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelDelete.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelDelete.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelDelete.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelDelete.deleted_stage)
            .setFooter({ text: `${language_result.channelDelete.embed_footer}`, iconURL: `${language_result.channelDelete.embed_icon_url}` })
            .setColor(0x80131e);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CANCELLATO UN CANALE DI ANNUNCI
        if (channel.type == 5) {
          const fields = [{ name: `${language_result.channelDelete.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelDelete.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelDelete.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelDelete.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelDelete.deleted_announce)
            .setFooter({ text: `${language_result.channelDelete.embed_footer}`, iconURL: `${language_result.channelDelete.embed_icon_url}` })
            .setColor(0x80131e);
          channel_logs.send({ embeds: [embedLog] });
        }
      }
    }
    catch (error) {
      errorSendControls(error, channel.guild.client, channel.guild, "\\logs_system\\ChannelDelete.js");
    }


  },
};