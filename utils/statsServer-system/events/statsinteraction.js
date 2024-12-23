// Code: utils/statsServer-system/events/statsinteraction.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file statsinteraction.js
 * @module statsinteraction
 * @description Questo file gestisce l'evento per l'interazione con i bottoni di Stats Server!
 */

const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { readDbAllWith2Params, runDb, readDbWith3Params, readDbWith4Params, readDb, readDbAll } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const moment = require('moment-timezone');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { client } = require('../../../bin/client');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.guild) return;
    if (!await checkFeaturesIsEnabled(interaction.guild.id, 6)) return;
    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id);
      const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (interaction.customId == 'statsModal') {
        const customEmoji = emoji.statsServerSystem.main;
        let nameChannel = interaction.fields.getTextInputValue('statsChannelName');
        let categoryId = interaction.fields.getTextInputValue('statsCategoryId');
        let type = interaction.fields.getTextInputValue('statsTypeChannel');

        const checkCategory = await readDb('SELECT * FROM statistics_category WHERE guilds_id = ? AND category_id = ?', interaction.guild.id, categoryId)

        // CONTROLLI PER IL MARKDOWN DEI CANALI

        let channelCheck = (checkCategory && parseInt(type) > 3 && parseInt(type) < 9 && nameChannel.includes("{0}")); // Controllo tutti i canali tranne status bar, ora, data e (ora data)

        let channelDateCheck = (checkCategory && parseInt(type) == 1 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}"))); // Controllo i canali di data

        let channelHourCheck = (checkCategory && parseInt(type) == 2 && (nameChannel.includes("{0}") || nameChannel.includes("{1}"))); // Controllo i canali di ora

        let channelDateHourCheck = (checkCategory && parseInt(type) == 3 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}") || nameChannel.includes("{3}") || nameChannel.includes("{4}"))); // Controllo i canali di data e ora

        let channelStatusCheck = (checkCategory && parseInt(type) == 9 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}"))); // Controllo status bar tranne gli altri canali

        //  -----------------------------------------

       if (channelCheck || channelStatusCheck || channelDateCheck || channelHourCheck || channelDateHourCheck) {
          const category = await interaction.guild.channels.fetch(categoryId);
          // CREO IL CANALE NELLA CATEGORIA
          const channel = await interaction.guild.channels.create({
            parent: category,
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone,
                allow: [PermissionsBitField.Flags.ViewChannel],
                deny: [PermissionsBitField.Flags.Connect],
                type: 0,
              }
            ],
            name: "Loading (few minutes)...",
          });
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelStatsCommand.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.channelStatsCommand.description_embed.replace("{0}", `${channel}`))
            .setFooter({ text: `${language_result.channelStatsCommand.embed_footer}`, iconURL: `${language_result.channelStatsCommand.embed_icon_url}` })
            .setColor(0x32a852);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
          await runDb('INSERT INTO statistics (guilds_id, channel_id, type, channel_name) VALUES (?, ?, ?, ?)', interaction.guild.id, channel.id, parseInt(type), nameChannel);
          if(!checkCategory) await runDb('INSERT INTO statistics_category (guilds_id, category_id) VALUES (?, ?)', interaction.guild.id, categoryId);
        } else {
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.categoryNotFound.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.categoryNotFound.description_embed)
            .setFooter({ text: `${language_result.categoryNotFound.embed_footer}`, iconURL: `${language_result.categoryNotFound.embed_icon_url}` })
            .setColor(0xad322a);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
        }
      }

      if (interaction.customId == 'statsModalEdit') {
        const customEmoji = await getEmojifromUrl(interaction.client, "stats");
        let nameChannel = interaction.fields.getTextInputValue('statsChannelName');
        let channelId = interaction.fields.getTextInputValue('statsChannelId');

        const checkChannel = await readDb('SELECT * FROM statistics WHERE guilds_id = ? AND channel_id = ?', interaction.guild.id, channelId)

        // CONTROLLI PER IL MARKDOWN DEI CANALI

        let channelCheck = (checkChannel && checkChannel.type > 3 && checkChannel.type < 9 && nameChannel.includes("{0}")); // Controllo tutti i canali tranne status bar, ora, data e (ora data)

        let channelDateCheck = (checkChannel && checkChannel.type == 1 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}"))); // Controllo i canali di data

        let channelHourCheck = (checkChannel && checkChannel.type == 2 && (nameChannel.includes("{0}") || nameChannel.includes("{1}"))); // Controllo i canali di ora

        let channelDateHourCheck = (checkChannel && checkChannel.type == 3 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}") || nameChannel.includes("{3}") || nameChannel.includes("{4}"))); // Controllo i canali di data e ora

        let channelStatusCheck = (checkChannel && checkChannel.type == 9 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}"))); // Controllo status bar tranne gli altri canali

        //  -----------------------------------------

       if (channelCheck || channelStatusCheck || channelDateCheck || channelHourCheck || channelDateHourCheck) {
          const channel = await interaction.guild.channels.fetch(channelId);
          // EDUTI IL CANALE NELLA CATEGORIA
          await channel.edit({
            name: "Update (few minutes)...",
          });

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelUpdateCommand.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.channelUpdateCommand.description_embed.replace("{0}", `${channel}`))
            .setFooter({ text: `${language_result.channelUpdateCommand.embed_footer}`, iconURL: `${language_result.channelUpdateCommand.embed_icon_url}` })
            .setColor(0x32a852);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
          await runDb('UPDATE statistics SET channel_name = ? WHERE guilds_id = ? AND channel_id = ?', nameChannel, interaction.guild.id, channelId);
        } else {
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelNotFound.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.channelNotFound.description_embed)
            .setFooter({ text: `${language_result.channelNotFound.embed_footer}`, iconURL: `${language_result.channelNotFound.embed_icon_url}` })
            .setColor(0xad322a);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
        }
      }

    }
    catch (error) {
      console.log(error)
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\statsServer-system\\ticketInteraction.js");
    }
  },
};

async function statisticsUpdate(client) {
  async function timeZoneManage(guild) {
    config = await readDb('SELECT * FROM guilds WHERE guilds_id = ?', guild.id);
    let date = moment(Date.now());
    return date.tz(config?.time_zone);
  }
  const channelsData = await readDbAll("SELECT * FROM statistics");
  for (const data of channelsData) {
    const guild = await client.guilds.fetch(data.guilds_id);
    const channel = await guild.channels.fetch(data.channel_id);
    if(!await checkFeaturesIsEnabled(guild, 6)) return;
    try {
      // DATA TYPE STATS
      if (data.type == 1) {
        let date = await timeZoneManage(guild);

        // DAY STABLER
        let day;
        if (date.date().toString().length == 1) {
          day = `0${date.date()}`
        } else {
          day = `${date.date()}`
        }

        // MONTH STABLER
        let month;
        if ((date.month() + 1).toString().length == 1) {
          month = `0${date.month() + 1}`
        } else {
          month = `${date.month() + 1}`
        }

        await channel.edit({
          name: data.channel_name
          .replace("{0}", `${day}`)
          .replace("{1}", `${month}`)
          .replace("{2}", `${date.year()}`),
        });
      }
      // END DATA TYPE STATS

      // HOUR TYPE STATS
      if (data.type == 2) {
        let date = await timeZoneManage(guild);

        // HOUR STABLER
        let hour;
        if (date.hour().toString().length == 1) {
          hour = `0${date.hour()}`
        } else {
          hour = `${date.hour()}`
        }

        // MINUTE STABLER
        let minute;
        if ((date.minute()).toString().length == 1) {
          minute = `0${date.minute()}`
        } else {
          minute = `${date.minute()}`
        }
        const hourformat = `${hour}:${minute}`
        await channel.edit({
          name: data.channel_name
          .replace("{0}", `${hour}`)
          .replace("{1}", `${minute}`),
        });
      }
      // END HOUR TYPE STATS

      // TIME/HOUR TYPE STATS
      if (data.type == 3) {
        let date = await timeZoneManage(guild);

        // HOUR STABLER
        let hour;
        if (date.hour().toString().length == 1) {
          hour = `0${date.hour()}`
        } else {
          hour = `${date.hour()}`
        }

        // MINUTE STABLER
        let minute;
        if ((date.minute()).toString().length == 1) {
          minute = `0${date.minute()}`
        } else {
          minute = `${date.minute()}`
        }
        // DAY STABLER
        let day;
        if (date.date().toString().length == 1) {
          day = `0${date.date()}`
        } else {
          day = `${date.date()}`
        }

        // MONTH STABLER
        let month;
        if ((date.month() + 1).toString().length == 1) {
          month = `0${date.month() + 1}`
        } else {
          month = `${date.month() + 1}`
        }

        await channel.edit({
          name: data.channel_name
          .replace("{0}", `${day}`)
          .replace("{1}", `${month}`)
          .replace("{2}", `${date.year()}`)
          .replace("{3}", `${hour}`)
          .replace("{4}", `${minute}`),
        });

      }
      // END TIME/HOUR TYPE STATS

      // MEMBER COUNT
      if (data.type == 4) {
        await channel.edit({
          name: data.channel_name.replace("{0}", `${guild.memberCount}`),
        });
      }
      // END MEMBER COUNT

      // CHANNEL COUNT
      if (data.type == 5) {
        let channelCount = 0;
        const member = await guild.channels.fetch();
        await member.each(value => {
          if (value) {
            channelCount++;
          }
        })
        await channel.edit({
          name: data.channel_name.replace("{0}", `${channelCount}`),
        });
      }
      // END CHANNEL COUNT

      // BOT COUNT
      if (data.type == 6) {
        let botCount = 0;
        const member = await guild.members.fetch();
        await member.each(value => {
          if (value.user.bot) {
            botCount++;
          }
        })
        await channel.edit({
          name: data.channel_name.replace("{0}", `${botCount}`),
        });
      }
      // END BOT COUNT

      // ROLE COUNT
      if (data.type == 7) {
        let roleCount = 0;
        let arrayMember = [];
        const permissions = await channel.permissionOverwrites.cache;
        for await (const value of permissions) {
          if (value[1].id != guild.roles.everyone.id && value[1].deny == PermissionsBitField.Flags.ReadMessageHistory) {
            const guildMembers = await guild.members.fetch();
            for await (const member of guildMembers) {
              for await (const role of member[1].roles.cache) {
                const foundMember = arrayMember.find((memberId) => memberId == member[1].id);
                if (role[1].id == value[1].id && !foundMember) {
                  arrayMember.push(member[1].id);
                  roleCount++;
                }
              }
            }
          }
        }
        await channel.edit({
          name: data.channel_name.replace("{0}", `${roleCount}`),
        });
      }
      // END ROLE COUNT

      // ROLE COUNT ONLINE
      if (data.type == 8) {
        let roleCount = 0;
        let arrayMember = [];
        const permissions = await channel.permissionOverwrites.cache;
        for await (const value of permissions) {
          if (value[1].id != guild.roles.everyone.id && value[1].deny == PermissionsBitField.Flags.ReadMessageHistory) {
            const guildMembers = await guild.members.fetch();
            for await (const member of guildMembers) {
              for await (const role of member[1].roles.cache) {
                const foundMember = arrayMember.find((memberId) => memberId == member[1].id);
                if (role[1].id == value[1].id && (member[1].presence?.status == "online" || member[1].presence?.status == "idle" || member[1].presence?.status == "dnd") && !foundMember) {
                  arrayMember.push(member[1].id);
                  roleCount++;
                }
              }
            }
          }
        }
        await channel.edit({
          name: data.channel_name.replace("{0}", `${roleCount}`),
        });
      }
      // END ROLE COUNT ONLINE

      // STATUS BAR COUNT
      if (data.type == 9) {
        let online = 0;
        let idle = 0;
        let dnd = 0;

        const guildMembers = await guild.members.fetch();
        for await (const member of guildMembers) {
          if (member[1].presence?.status == "online") {
            online++;
          } else if(member[1].presence?.status == "idle") {
            idle++;
          } else if(member[1].presence?.status == "dnd") {
            dnd++;
          } 
        }
        await channel.edit({
          name: data.channel_name
          .replace("{0}", `${online}`)
          .replace("{1}", `${dnd}`)
          .replace("{2}", `${idle}`),
        });
      }
      // END STATUS BAR COUNT
    }
    catch (error){
      errorSendControls(error, guild.client, guild, "\\statsServer-system\\statsinteraction.js");
    }


  }
}

setInterval(async () => {
  await statisticsUpdate(client);
}, 600000);