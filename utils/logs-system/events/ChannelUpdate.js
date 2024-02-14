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
        if (!result.channelState_channel) return;
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
                    { name: " ", value: " " },
                    { name: `${language_result.channelUpdate.id_channel}`, value: `${oldChannel.id}` },
                    { name: " ", value: " " },
                    { name: `${language_result.channelUpdate.go_channel}`, value: `${newChannel.url}`, inline: true }];
                    if (oldChannel.parentId) {
                      fields.push({ name: `${language_result.channelUpdate.category_channel}`, value: `${newChannel.parent.name}`, inline: true });
                    }

                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                      .addFields(fields)
                      .setDescription(language_result.channelUpdate.name_change_embed)
                      .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
                      .setColor(0xebb734);
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
                      .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                      .addFields(fields)
                      .setDescription(language_result.channelUpdate.category_change_embed)
                      .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
                      .setColor(0xebb734);
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
                      .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                      .addFields(fields)
                      .setDescription(language_result.channelUpdate.bitrate_change_embed)
                      .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
                      .setColor(0xebb734);
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
                      .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                      .addFields(fields)
                      .setDescription(language_result.channelUpdate.userlimit_change_embed)
                      .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
                      .setColor(0xebb734);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                  // SE LA DESCRIZIONE VIENE CAMBIATA
                  if (oldChannel.topic != newChannel.topic) {
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
                      .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                      .addFields(fields)
                      .setDescription(language_result.channelUpdate.description_change_embed)
                      .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
                      .setColor(0xebb734);
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
                      .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                      .addFields(fields)
                      .setDescription(language_result.channelUpdate.ratelimit_change_embed)
                      .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
                      .setColor(0xebb734);
                    channel_logs.send({ embeds: [embedLog] });
                  }
                  // SE I PERMESSI VENGONO AGGIORNATI
                  if (oldChannel.permissionOverwrites.cache.difference(newChannel.permissionOverwrites.cache).size > 0) {
                    let oldValuePermissions = " ", newValuePermissions = " ";
                    oldChannel.permissionOverwrites.cache.each(perms => {
                      if(perms.type == 0) {
                        oldChannel.guild.roles.fetch(perms.id)
                          .then(value => {
                            oldValuePermissions += `${value}\n`
                          })
                      } else if (perms.type == 1) {
                        oldChannel.guild.members.fetch(perms.id)
                        .then(value => {
                          oldValuePermissions += `${value}\n`
                        })
                      }
                    });
                    newChannel.permissionOverwrites.cache.each(perms => {
                      if(perms.type == 0) {
                        newChannel.guild.roles.fetch(perms.id)
                          .then(value => {
                            newValuePermissions += `${value}\n`
                          })
                      } else if (perms.type == 1) {
                        newChannel.guild.members.fetch(perms.id)
                        .then(value => {
                          newValuePermissions += `${value}\n`
                        })
                      }
                    });
                    setTimeout(() => {
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
                        .setAuthor({ name: `${language_result.channelUpdate.embed_title}` })
                        .addFields(fields)
                        .setDescription(language_result.channelUpdate.permissions_change_embed)
                        .setFooter({ text: `${language_result.channelUpdate.embed_footer}`, iconURL: `${language_result.channelUpdate.embed_icon_url}` })
                        .setColor(0xebb734);
                      channel_logs.send({ embeds: [embedLog] });
                   }, 2000);
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