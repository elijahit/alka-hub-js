const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb, readDbAllWith2Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

// QUERY DEFINITION
let sql = `SELECT * FROM logs_system WHERE guilds_id = ?`;
// ------------ //

module.exports = {
  name: Events.ChannelCreate,
  async execute(channel) {
    let customEmoji = emoji.general.newMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, channel.guild.id);
    if (!resultDb) return;
    if (!await checkFeaturesIsEnabled(channel.guild, 1)) return;
    if (!resultDb["channel_state_channel"]) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      const channelStatsSystem = await readDb(`SELECT * FROM statistics WHERE channel_id = ? AND guilds_id = ?`, channel.id, channel.guild.id);
      if (channelStatsSystem?.channel_id) return;
      // CONTROLLO DELLA LINGUA
      if (channel.guild?.id) {
        let data = await language.databaseCheck(channel.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await channel.guild.channels.fetch(resultDb["channel_state_channel"])
        // SE VIENE CREATO UN CANALE TESTUALE
        if (channel.type == 0) {
          const fields = [{ name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelCreate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelCreate.created_channel)
            .setFooter({ text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}` })
            .setColor(colors.general.success);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CREATO UN CANALE VOCALE
        else if (channel.type == 2) {
          const fields = [{ name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelCreate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelCreate.created_channel_voice)
            .setFooter({ text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}` })
            .setColor(colors.general.success);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CREATA UNA CATEGORIA
        else if (channel.type == 4) {
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelCreate.embed_title}`, iconURL: customEmoji })
            .addFields(
              { name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
              { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
              { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}` })
            .setDescription(language_result.channelCreate.created_category)
            .setFooter({ text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}` })
            .setColor(colors.general.success);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CREATO UN FORUM
        if (channel.type == 15) {
          const fields = [{ name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelCreate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelCreate.created_forum)
            .setFooter({ text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}` })
            .setColor(colors.general.success);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CREATO UN CANALE MEDIA
        else if (channel.type == 16) {
          const fields = [{ name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelCreate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelCreate.created_media)
            .setFooter({ text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}` })
            .setColor(colors.general.success);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CREATO UN CANALE THREAD PRIVATO
        else if (channel.type == 12) {
          const fields = [{ name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelCreate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelCreate.created_private_thread)
            .setFooter({ text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}` })
            .setColor(colors.general.success);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CREATO UN CANALE THREAD PUBBLICO
        else if (channel.type == 11) {
          const fields = [{ name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelCreate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelCreate.created_public_thread)
            .setFooter({ text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}` })
            .setColor(colors.general.success);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CREATO UN CANALE STAGE
        if (channel.type == 13) {
          const fields = [{ name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelCreate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelCreate.created_stage)
            .setFooter({ text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}` })
            .setColor(colors.general.success);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE VIENE CREATO UN CANALE DI ANNUNCI
        if (channel.type == 5) {
          const fields = [{ name: `${language_result.channelCreate.name_channel}`, value: `${channel.name}`, inline: true },
          { name: `${language_result.channelCreate.id_channel}`, value: `${channel.id}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelCreate.go_channel}`, value: `${channel.url}`, inline: true }];

          if (channel.parentId) {
            fields.push({ name: `${language_result.channelCreate.category_channel}`, value: `${channel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelCreate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelCreate.created_announce)
            .setFooter({ text: `${language_result.channelCreate.embed_footer}`, iconURL: `${language_result.channelCreate.embed_icon_url}` })
            .setColor(colors.general.success);
          channel_logs.send({ embeds: [embedLog] });
        }
      }
    }
    catch (error) {
      errorSendControls(error, channel.guild.client, channel.guild, "\\logs_system\\ChannelCreate.js");
    }
  },
};