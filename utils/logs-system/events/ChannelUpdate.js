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
  name: Events.ChannelUpdate,
  async execute(oldChannel, newChannel) {
    let customEmoji = emoji.general.updateMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, oldChannel.guild.id);
    if (!resultDb) return;
    if (!await checkFeaturesIsEnabled(oldChannel.guild, 1)) return;
    if (!resultDb["channel_state_channel"]) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // TODO DA AGGIORNARE CON STATS SYSTEM
      // const channelStatsSystem = await readDbAllWith2Params(`SELECT * FROM stats_system_channel WHERE channelId = ? AND guildId = ?`, oldChannel.id, oldChannel.guild.id);
      // if (channelStatsSystem[0]?.channelId) return;
      // CONTROLLO DELLA LINGUA
      if (oldChannel.guild?.id) {
        let data = await language.databaseCheck(oldChannel.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await oldChannel.guild.channels.fetch(resultDb["channel_state_channel"]);
        // SE IL NOME DI UN CANALE VIENE CAMBIATO
        if (oldChannel.name != newChannel.name) {
          const fields = [{ name: `${language_result.channelUpdate.old_name}`, value: `${oldChannel.name}`, inline: true },
          { name: `${language_result.channelUpdate.new_name}`, value: `${newChannel.name}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}` },
          { name: " ", value: " " },
          { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true }];
          if (oldChannel.parentId) {
            fields.push({ name: `${language_result.channelUpdate.category_channel}`, value: `${newChannel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelUpdate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelUpdate.name_change_embed)
            .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
            .setColor(colors.general.danger);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE LA CATEGORIA DI UN CANALE VIENE CAMBIATA
        if (oldChannel.parentId != newChannel.parentId) {
          const fields = [];
          if (oldChannel.parentId) {
            fields.push({ name: `${language_result.channelUpdate.old_category}`, value: `${oldChannel.parent.name}`, inline: true });
          }
          else {
            fields.push({ name: `${language_result.channelUpdate.old_category}`, value: `${language_result.channelUpdate.empty_category}`, inline: true });
          }
          if (newChannel.parentId) {
            fields.push({ name: `${language_result.channelUpdate.new_category}`, value: `${newChannel.parent.name}`, inline: true });
          } else {
            fields.push({ name: `${language_result.channelUpdate.new_category}`, value: `${language_result.channelUpdate.empty_category}`, inline: true });
          }
          fields.push({ name: " ", value: " " },
            { name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}` },
            { name: " ", value: " " },
            { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true })

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelUpdate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelUpdate.category_change_embed)
            .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
            .setColor(colors.general.danger);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE IL BITRATE VIENE CAMBIATO
        if (oldChannel.bitrate != newChannel.bitrate) {
          const fields = [{ name: `${language_result.channelUpdate.old_bitrate}`, value: `${oldChannel.bitrate}`, inline: true },
          { name: `${language_result.channelUpdate.new_bitrate}`, value: `${newChannel.bitrate}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}` },
          { name: " ", value: " " },
          { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true }];
          if (oldChannel.parentId) {
            fields.push({ name: `${language_result.channelUpdate.category_channel}`, value: `${newChannel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelUpdate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelUpdate.bitrate_change_embed)
            .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
            .setColor(colors.general.danger);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE IL LIMITE DEGLI UTENTI VIENE CAMBIATO
        if (oldChannel.userLimit != newChannel.userLimit) {
          const fields = [{ name: `${language_result.channelUpdate.old_userlimit}`, value: `${oldChannel.userLimit}`, inline: true },
          { name: `${language_result.channelUpdate.new_userlimit}`, value: `${newChannel.userLimit}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}` },
          { name: " ", value: " " },
          { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true }];
          if (oldChannel.parentId) {
            fields.push({ name: `${language_result.channelUpdate.category_channel}`, value: `${newChannel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelUpdate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelUpdate.userlimit_change_embed)
            .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
            .setColor(colors.general.danger);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE LA DESCRIZIONE VIENE CAMBIATA
        if (oldChannel.topic != newChannel.topic && newChannel.topic?.length > 0) {
          const fields = [];
          if (oldChannel.topic) {
            fields.push({ name: `${language_result.channelUpdate.old_description}`, value: `${oldChannel.topic}`, inline: true });
          } else {
            fields.push({ name: `${language_result.channelUpdate.old_description}`, value: `${language_result.channelUpdate.old_description_empty}`, inline: true });
          }
          fields.push({ name: `${language_result.channelUpdate.new_description}`, value: `${newChannel.topic}`, inline: true },
            { name: " ", value: " " },
            { name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}` },
            { name: " ", value: " " },
            { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true });
          if (oldChannel.parentId) {
            fields.push({ name: `${language_result.channelUpdate.category_channel}`, value: `${newChannel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelUpdate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelUpdate.description_change_embed)
            .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
            .setColor(colors.general.danger);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE LO SLOWMODE VIENE CAMBIATO
        if (oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser) {
          const fields = [];
          if (oldChannel.rateLimitPerUser) {
            fields.push({ name: `${language_result.channelUpdate.old_ratelimit}`, value: `${oldChannel.rateLimitPerUser} ${language_result.channelUpdate.ratelimit_seconds}`, inline: true });
          } else {
            fields.push({ name: `${language_result.channelUpdate.old_ratelimit}`, value: `${language_result.channelUpdate.ratelimit_empty}`, inline: true });
          }
          if (newChannel.rateLimitPerUser) {
            fields.push({ name: `${language_result.channelUpdate.new_ratelimit}`, value: `${newChannel.rateLimitPerUser}  ${language_result.channelUpdate.ratelimit_seconds}`, inline: true })
          } else {
            fields.push({ name: `${language_result.channelUpdate.new_ratelimit}`, value: `${language_result.channelUpdate.ratelimit_empty}`, inline: true })
          }
          fields.push({ name: " ", value: " " },
            { name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}` },
            { name: " ", value: " " },
            { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true });
          if (oldChannel.parentId) {
            fields.push({ name: `${language_result.channelUpdate.category_channel}`, value: `${newChannel.parent.name}`, inline: true });
          }

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelUpdate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelUpdate.ratelimit_change_embed)
            .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
            .setColor(colors.general.danger);
          channel_logs.send({ embeds: [embedLog] });
        }
        // SE I PERMESSI VENGONO AGGIORNATI
        if (oldChannel.permissionOverwrites.cache.difference(newChannel.permissionOverwrites.cache).size > 0) {
          let oldValuePermissions = " ", newValuePermissions = " ";
          oldChannel.permissionOverwrites.cache.each(async perms => {
            if (perms.type == 0) {
              try {
                let value = await oldChannel.guild.roles.fetch(perms.id);
                oldValuePermissions += `${value}\n`;
              } catch {}
            } else if (perms.type == 1) {
              try {
                let value = await oldChannel.guild.members.fetch(perms.id);
                oldValuePermissions += `${value}\n`;
              } catch {}
            }
          });
          newChannel.permissionOverwrites.cache.each(async perms => {
            if (perms.type == 0) {
              let value = await newChannel.guild.roles.fetch(perms.id);
              newValuePermissions += `${value}\n`;
            } else if (perms.type == 1) {
              let value = await newChannel.guild.members.fetch(perms.id);
              newValuePermissions += `${value}\n`;
            }
          });
          const fields = [{ name: `${language_result.channelUpdate.old_permissions}`, value: `${oldValuePermissions}`, inline: true },
          { name: `${language_result.channelUpdate.new_permissions}`, value: `${newValuePermissions}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}` },
          { name: " ", value: " " },
          { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true }];
          if (oldChannel.parentId) {
            fields.push({ name: `${language_result.channelUpdate.category_channel}`, value: `${newChannel.parent.name}`, inline: true });
          }
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelUpdate.embed_title}`, iconURL: customEmoji })
            .addFields(fields)
            .setDescription(language_result.channelUpdate.permissions_change_embed)
            .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
            .setColor(colors.general.danger);
          channel_logs.send({ embeds: [embedLog] });
        }
      }
    }
    catch (error) {
      errorSendControls(error, oldChannel.client, oldChannel.guild, "\\logs_system\\ChannelUpdate.js");
    }
  },
};