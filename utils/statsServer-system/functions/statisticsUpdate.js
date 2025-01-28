const checkFeaturesIsEnabled = require("../../../bin/functions/checkFeaturesIsEnabled");
const { checkFeatureSystemDisabled } = require("../../../bin/functions/checkFeatureSystemDisabled");
const { checkPremiumFeature } = require("../../../bin/functions/checkPremiumFeature");
const { findGuildById, findAllStatistics } = require("../../../bin/service/DatabaseService");
const moment = require('moment-timezone');

async function statisticsUpdate(client, variables) {
  async function timeZoneManage(guild, variables) {
    let config = await findGuildById(guild.id, variables);
    config = config?.get({ plain: true });
    if (!config) return;
    let date = moment(Date.now());
    return date.tz(config.time_zone);
  }
  while (true) {
    const channelsData = await findAllStatistics(variables);
    for (const data of channelsData) {
      let guild, channel;
      try {
        guild = await client.guilds.fetch(data.guild_id);
        channel = await guild.channels.fetch(data.channel_id);
      } catch {
        continue;
      }
      if (!await checkFeatureSystemDisabled(6)) continue;
      if (!await checkFeaturesIsEnabled(guild.id, 6, variables)) continue;
      if (!await checkPremiumFeature(guild.id, 6, variables)) continue;
      try {
        // DATA TYPE STATS
        if (data.type == 1) {
          let date = await timeZoneManage(guild, variables);

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
          let date = await timeZoneManage(guild, variables);

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
          let date = await timeZoneManage(guild, variables);

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
            } else if (member[1].presence?.status == "idle") {
              idle++;
            } else if (member[1].presence?.status == "dnd") {
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
      catch (error) {
        errorSendControls(error, guild.client, guild, "\\statsServer-system\\statsinteraction.js", variables);
        continue;
      }

    }
    await new Promise((resolve) => setTimeout(resolve, 600000));
  }
}

module.exports = {
  statisticsUpdate
};