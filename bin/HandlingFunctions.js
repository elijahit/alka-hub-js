const { guildMainId, guildMainChannelsControlsError, emojiGuildId_01 } = require('../config.json');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { readDbWith3Params, readDb, readDbAll, runDb, readDbAllWith2Params, readDbAllWithValue } = require("../bin/database");
const { readFileSync, readdir, writeFile } = require("fs");
const { stripIndents } = require('common-tags');

function errorSendControls(error, client, guild_error, system) {
  if (error == "DiscordAPIError[50013]: Missing Permissions") {
    return guild_error.channels.fetch()
      .then(channels => {
        let MissingMessage = false;
        channels.each(channel => {
          if (!MissingMessage) {
            if (channel.type == 0) {
              const embedLog = new EmbedBuilder()
                .setAuthor({ name: `Alka Hub | Missing Permissions` })
                .setDescription("You haven't invited Alka Hub correctly and you don't have permission to perform this action. We invite you to invite Alka Hub again or contact our [support discord](https://discord.gg/X7KPcynxfB).\n\n-> [Invite Again](https://discord.com/api/oauth2/authorize?client_id=843183839869665280&permissions=8&scope=bot+applications.commands)")
                .setFooter({ text: `Alka Hub di alkanetwork.eu`, iconURL: `https://cdn.discordapp.com/app-icons/843183839869665280/6bafa96797abd3b0344721c58d6e5502.png` })
                .setColor(0x7a090c);
              channel.send({ embeds: [embedLog] });
              MissingMessage = true;
            }
          }
        })
      })
  }
  // LEGGO E AGGIORNO IL FILE DI LOGS
  readdir("./", async (_, files) => {
    for (const file of files) {
      errorResult = new Error(`${system}`, { cause: error });

      if (file == "logs.txt") {
        const data = readFileSync('./logs.txt',
          { encoding: 'utf8', flag: 'r' });

        writeFile("./logs.txt", stripIndents`${data}\n\
          ---- [START LOGS] ----\n\
          [${errorResult.message}]\n\
          ${errorResult.cause.stack}\n\
          ----- [END LOGS] -----\n\n`, {
          encoding: "utf8",
          flag: "w",
          mode: 0o666
        },
          (err) => {
            if (err)
              console.log(err);
            else {
              console.log("[ERRORE] visualizza logs.txt per capire di che si tratta");
            }
          });
      }
    }
  })

  // LA FUNZIONE GESTISCE GLI ERRORI E LI MANDA AL SERVER MAIN
  client.guilds.fetch(guildMainId)
    .then(guild => {
      guild.channels.fetch(guildMainChannelsControlsError)
        .then(channel => {
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: "Alka Hub | Controls Error ❌" })
            .addFields(
              { name: `Informazioni Guilds`, value: `*Nome Server*\n${guild_error.name}\n*ID Server*\n${guild_error.id}`, inline: true },
              { name: `Owner Guilds | Members`, value: `*Owner ID*\n${guild_error.ownerId}\n*Membri totali*\n${guild_error.memberCount}`, inline: true },
              { name: "Errore riscontrato", value: `${error.message}` })
            .setDescription(`Abbiamo riscontrato un errore in ${system}`)
            .setColor(0x7a3131)
            .setImage(`https://cdn.discordapp.com/icons/${guild_error.id}/${guild_error.icon}.png`);
          channel.send({ embeds: [embedLog] });
        })
    })
}

function getEmojiIdbyName(client, name) {
  // LA FUNZIONE RITORNA L'ID DEL EMOJI TRAMITE IL NOME NEL SERVER EMOJI
  return client.guilds.fetch(emojiGuildId_01).then(guild => {
    return guild.emojis.fetch().then(emojis => {
      let emojiResult;
      emojis.each(emoji => {
        if (emoji.name == name) {
          emojiResult = emoji.id
        }
      });
      return emojiResult;
    });
  });
}

async function getEmoji(client, name) {
  // LA FUNZIONE RITORNA L'EMOIJ TRAMITE IL NOME NEL SERVER EMOJI
  let emojiId;
  await getEmojiIdbyName(client, name).then(value => {
    emojiId = value;
  })
  return client.guilds.fetch(emojiGuildId_01)
    .then(guild => {
      return guild.emojis.fetch(emojiId)
        .then(emoji => {
          return emoji;
        })
    })
    .catch(() => {
      console.error("[ERROR] Non sono riuscito a trovare la tua emoji");
    });
}

async function getEmojifromUrl(client, name) {
  // LA FUNZIONE RITORNA L'URL DELL'EMOJI
  emoji = await getEmojiIdbyName(client, name);
  return `https://cdn.discordapp.com/emojis/${emoji}.webp?size=44&quality=lossless`;
}

async function checkHavePermissions(interaction, pex) {
  const member = interaction.member;
  // LA FUNZIONE CONTROLLA NEL DATABASE SE ALMENO UNO DEI RUOLI
  // E' PRESENTE NEL HASH DI PERMESSO
  let checkSqlRole = `SELECT * FROM rank_system_permissions WHERE guildId = ? AND roleId = ? AND hashRank = ?`;
  let check = false, admin = false;
  for (role of member.roles.cache) {
    const result = await readDbWith3Params(checkSqlRole, member.guild.id, role[1].id, pex);
    // la funzione .has tende a dare errore se non sei admin, quindi crasha
    // l'ho inserito in un try per non farlo crashare e gestire i valori
    try {
      if (member.permissionsIn(interaction.channel).has("ADMINISTRATOR")) {
        admin = true;
      }
    }
    catch {
      admin = false;
    }
    if (result || admin) {
      if (check == false) {
        return check = true
      }
    }
  }
  return false;
}

async function returnPermission(interaction, pex, fn) {
  if (await checkHavePermissions(interaction, pex)) {
    return fn(true);
  } else {
    return fn(false);
  }
}

async function noInitGuilds(interaction) {
  let customEmoji = await getEmojifromUrl(interaction.client, "checkinit");
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `Alka Hub | Init Controls`, iconURL: customEmoji })
    .setDescription("You can't execute this command at the moment. You need to initialize Alka first with **/init**")
    .setFooter({ text: `Alka Hub by alkanetwork.eu`, iconURL: `https://cdn.discordapp.com/app-icons/843183839869665280/6bafa96797abd3b0344721c58d6e5502.png` })
    .setColor(0x4287f5);
  return await interaction.reply({ embeds: [embedLog], ephemeral: true });
}

async function noEnabledFunc(interaction, language) {
  let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `Alka Hub | Features Controls`, iconURL: customEmoji })
    .setDescription(language)
    .setFooter({ text: `Alka Hub by alkanetwork.eu`, iconURL: `https://cdn.discordapp.com/app-icons/843183839869665280/6bafa96797abd3b0344721c58d6e5502.png` })
    .setColor(0x4287f5);
  return await interaction.reply({ embeds: [embedLog], ephemeral: true });
}

async function noHavePermission(interaction, language) {
  let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `${language.noPermission.embed_title}`, iconURL: customEmoji })
    .setDescription(language.noPermission.description_embed)
    .setFooter({ text: `${language.noPermission.embed_footer}`, iconURL: `${language.noPermission.embed_icon_url}` })
    .setColor(0x4287f5);

  await interaction.reply({ embeds: [embedLog], ephemeral: true });
}

async function cleanerDatabase(client) {
  // CONTROLLO SE LA GUILD DI guilds_config NEL DATABASE SONO TRUE
  const checkGuildsConfig = await readDbAll('guilds_config');
  for (const value of checkGuildsConfig) {
    try {
      await client.guilds.fetch(value.guildId);
    } catch (error) {
      const errorCheck = new Error(error);
      if (errorCheck.message == "DiscordAPIError[10004]: Unknown Guild") {
        await runDb('DELETE FROM guilds_config WHERE guildId = ?', value.guildId);
      }
    }
  }

  // CONTROLLO SE LA GUILD DI log_system_config NEL DATABASE SONO TRUE
  const checkGuildsLogs = await readDbAll('log_system_config');
  for (const value of checkGuildsLogs) {
    try {
      await client.guilds.fetch(value.guildId);
    } catch (error) {
      const errorCheck = new Error(error);
      if (errorCheck.message == "DiscordAPIError[10004]: Unknown Guild") {
        await runDb('DELETE FROM log_system_config WHERE guildId = ?', value.guildId);
      }
    }
  }

  // CONTROLLO SE LA GUILD DI rank_system_permissions NEL DATABASE SONO TRUE
  const checkPermissionsGuilds = await readDbAll('rank_system_permissions');
  for (const value of checkPermissionsGuilds) {
    try {
      await client.guilds.fetch(value.guildId);
    } catch (error) {
      const errorCheck = new Error(error);
      if (errorCheck.message == "DiscordAPIError[10004]: Unknown Guild") {
        await runDb('DELETE FROM rank_system_permissions WHERE guildId = ?', value.guildId);
      }
    }
  }

  // CONTROLLO SE LA GUILD DI ticket_system_message NEL DATABASE SONO TRUE
  const checkTicketMessage = await readDbAll('ticket_system_message');
  for (const value of checkTicketMessage) {
    try {
      const guild = await client.guilds.fetch(value.guildId);
      const channel = await guild.channels.fetch(value.channelId);
      await channel.messages.fetch(value.messageId);
    } catch (error) {
      if (value.initAuthorId == null) {
        const errorCheck = new Error(error);
        if (errorCheck.message == "DiscordAPIError[10004]: Unknown Guild") {
          await runDb('DELETE FROM ticket_system_message WHERE guildId = ?', value.guildId);
        }
        else if (errorCheck.message == "DiscordAPIError[10003]: Unknown Channel") {
          await runDb('DELETE FROM ticket_system_message WHERE guildId = ? AND channelId = ?', value.guildId, value.channelId);
        }
        else if (errorCheck.message == "DiscordAPIError[10008]: Unknown Message") {
          await runDb('DELETE FROM ticket_system_message WHERE guildId = ? AND channelId = ? AND messageId = ?', value.guildId, value.channelId, value.messageId);
        }
      }
    }
  }

  // CONTROLLO SE LA GUILD DI ticket_system_tickets NEL DATABASE SONO TRUE
  const checkTicketChannel = await readDbAll('ticket_system_tickets');
  for (const value of checkTicketChannel) {
    try {
      const guild = await client.guilds.fetch(value.guildId);
      const channel = await guild.channels.fetch(value.channelId);
      await channel.messages.fetch(value.messageId);
    } catch (error) {
      const errorCheck = new Error(error);
      if (errorCheck.message == "DiscordAPIError[10004]: Unknown Guild") {
        await runDb('DELETE FROM ticket_system_tickets WHERE guildId = ?', value.guildId);
      }
      else if (errorCheck.message == "DiscordAPIError[10003]: Unknown Channel") {
        await runDb('DELETE FROM ticket_system_tickets WHERE guildId = ? AND channelId = ?', value.guildId, value.channelId);
      }
      else if (errorCheck.message == "DiscordAPIError[10008]: Unknown Message") {
        await runDb('DELETE FROM ticket_system_tickets WHERE guildId = ? AND channelId = ? AND messageId = ?', value.guildId, value.channelId, value.messageId);
      }
    }
  }

  // CONTROLLO SE LA GUILD DI autovoice_system_creator NEL DATABASE SONO TRUE
  const checkAutoVoiceCategory = await readDbAll('autovoice_system_creator');
  for (const value of checkAutoVoiceCategory) {
    try {
      const guild = await client.guilds.fetch(value.guildId);
      await guild.channels.fetch(value.categoryId);
    } catch (error) {
      const errorCheck = new Error(error);
      if (errorCheck.message == "DiscordAPIError[10004]: Unknown Guild") {
        await runDb('DELETE FROM autovoice_system_creator WHERE guildId = ?', value.guildId);
      }
      else if (errorCheck.message == "DiscordAPIError[10003]: Unknown Channel") {
        await runDb('DELETE FROM autovoice_system_creator WHERE guildId = ? AND categoryId = ?', value.guildId, value.categoryId);
      }
    }
  }

  // CONTROLLO SE LA GUILD DI stats_system_category NEL DATABASE SONO TRUE
  const checkStatsSystemCategory = await readDbAll('stats_system_category');
  for (const value of checkStatsSystemCategory) {
    try {
      const guild = await client.guilds.fetch(value.guildId);
      await guild.channels.fetch(value.categoryId);
    } catch (error) {
      const errorCheck = new Error(error);
      if (errorCheck.message == "DiscordAPIError[10004]: Unknown Guild") {
        await runDb('DELETE FROM stats_system_category WHERE guildId = ?', value.guildId);
      }
      else if (errorCheck.message == "DiscordAPIError[10003]: Unknown Channel") {
        await runDb('DELETE FROM stats_system_category WHERE guildId = ? AND categoryId = ?', value.guildId, value.categoryId);
      }
    }
  }

  // CONTROLLO SE LA GUILD DI stats_system_channel NEL DATABASE SONO TRUE
  const checkStatsSystemChannel = await readDbAll('stats_system_channel');
  for (const value of checkStatsSystemChannel) {
    try {
      const guild = await client.guilds.fetch(value.guildId);
      await guild.channels.fetch(value.categoryId);
    } catch (error) {
      const errorCheck = new Error(error);
      if (errorCheck.message == "DiscordAPIError[10004]: Unknown Guild") {
        await runDb('DELETE FROM stats_system_channel WHERE guildId = ?', value.guildId);
      }
      else if (errorCheck.message == "DiscordAPIError[10003]: Unknown Channel") {
        await runDb('DELETE FROM stats_system_channel WHERE guildId = ? AND channelId = ?', value.guildId, value.channelId);
      }
    }
  }
}

// REACTION ROLE SYSTEM
async function reactionRoleCached(client) {
  const reactionRoles = await readDbAll('reactionrole_system_reactions');
  for (const value of reactionRoles) {
    try {
      const guild = await client.guilds.fetch(value.guildId);
      const channel = await guild.channels.fetch(value.channelId);
      await channel.messages.fetch(value.messageId);
    } catch {
      await runDb('DELETE FROM reactionrole_system_reactions WHERE guildId = ? AND channelId = ? AND messageId = ?', value.guildId, value.channelId, value.messageId);
    }
  }
}

// DATE TIME ZONE FUNCTION
async function timeZoneManage(guild) {
  const config = await readDb('SELECT * FROM guilds_config WHERE guildId = ?', guild.id);
  if (config.timeZone?.includes("+")) {
    return new Date(Date.now() + (3600000 * parseInt(config.timeZone)));
  } if (config.timeZone?.includes("-")) {
    return new Date(Date.now() - (3600000 * parseInt(config.timeZone.split("-")[1])));
  } else {
    return new Date(Date.now());
  }

}

// STATS SERVER SYSTEM
async function statisticsUpdate(client) {
  console.log("start")
  const channelsData = await readDbAll("stats_system_channel");
  for (const data of channelsData) {
    const guild = await client.guilds.fetch(data.guildId);
    const channel = await guild.channels.fetch(data.channelId);
    // DATA TYPE STATS
    if (data.typeChannel == 1) {
      let date = await timeZoneManage(guild);

      // DAY STABLER
      let day;
      if (date.getUTCDate().toString().length == 1) {
        day = `0${date.getUTCDate()}`
      } else {
        day = `${date.getUTCDate()}`
      }

      // MONTH STABLER
      let month;
      if ((date.getUTCMonth() + 1).toString().length == 1) {
        month = `0${date.getUTCMonth() + 1}`
      } else {
        month = `${date.getUTCMonth() + 1}`
      }

      await channel.edit({
        name: data.markdown
        .replace("{0}", `${day}`)
        .replace("{1}", `${month}`)
        .replace("{2}", `${date.getFullYear()}`),
      });
    }
    // END DATA TYPE STATS

    // HOUR TYPE STATS
    if (data.typeChannel == 2) {
      let date = await timeZoneManage(guild);

      // HOUR STABLER
      let hour;
      if (date.getUTCHours().toString().length == 1) {
        hour = `0${date.getUTCHours()}`
      } else {
        hour = `${date.getUTCHours()}`
      }

      // MINUTE STABLER
      let minute;
      if ((date.getUTCMinutes()).toString().length == 1) {
        minute = `0${date.getUTCMinutes()}`
      } else {
        minute = `${date.getUTCMinutes()}`
      }
      const hourformat = `${hour}:${minute}`
      await channel.edit({
        name: data.markdown
        .replace("{0}", `${hour}`)
        .replace("{1}", `${minute}`),
      });
    }
    // END HOUR TYPE STATS

    // TIME/HOUR TYPE STATS
    if (data.typeChannel == 3) {
      let date = await timeZoneManage(guild);

      // HOUR STABLER
      let hour;
      if (date.getUTCHours().toString().length == 1) {
        hour = `0${date.getUTCHours()}`
      } else {
        hour = `${date.getUTCHours()}`
      }

      // MINUTE STABLER
      let minute;
      if ((date.getUTCMinutes()).toString().length == 1) {
        minute = `0${date.getUTCMinutes()}`
      } else {
        minute = `${date.getUTCMinutes()}`
      }
      // DAY STABLER
      let day;
      if (date.getUTCDate().toString().length == 1) {
        day = `0${date.getUTCDate()}`
      } else {
        day = `${date.getUTCDate()}`
      }

      // MONTH STABLER
      let month;
      if ((date.getUTCMonth() + 1).toString().length == 1) {
        month = `0${date.getUTCMonth() + 1}`
      } else {
        month = `${date.getUTCMonth() + 1}`
      }

      await channel.edit({
        name: data.markdown
        .replace("{0}", `${day}`)
        .replace("{1}", `${month}`)
        .replace("{2}", `${date.getFullYear()}`)
        .replace("{3}", `${hour}`)
        .replace("{4}", `${minute}`),
      });

    }
    // END TIME/HOUR TYPE STATS

    // MEMBER COUNT
    if (data.typeChannel == 4) {
      await channel.edit({
        name: data.markdown.replace("{0}", `${guild.memberCount}`),
      });
    }
    // END MEMBER COUNT

    // CHANNEL COUNT
    if (data.typeChannel == 5) {
      let channelCount = 0;
      const member = await guild.channels.fetch();
      await member.each(value => {
        if (value) {
          channelCount++;
        }
      })
      await channel.edit({
        name: data.markdown.replace("{0}", `${channelCount}`),
      });
    }
    // END CHANNEL COUNT

    // BOT COUNT
    if (data.typeChannel == 6) {
      let botCount = 0;
      const member = await guild.members.fetch();
      await member.each(value => {
        if (value.user.bot) {
          botCount++;
        }
      })
      await channel.edit({
        name: data.markdown.replace("{0}", `${botCount}`),
      });
    }
    // END BOT COUNT

    // ROLE COUNT
    if (data.typeChannel == 7) {
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
        name: data.markdown.replace("{0}", `${roleCount}`),
      });
    }
    // END ROLE COUNT

    // ROLE COUNT ONLINE
    if (data.typeChannel == 8) {
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
        name: data.markdown.replace("{0}", `${roleCount}`),
      });
    }
    // END ROLE COUNT ONLINE

    // STATUS BAR COUNT
    if (data.typeChannel == 9) {
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
        name: data.markdown
        .replace("{0}", `${online}`)
        .replace("{1}", `${dnd}`)
        .replace("{2}", `${idle}`),
      });
    }
    // END STATUS BAR COUNT


  }
}

module.exports = {
  errorSendControls,
  getEmoji,
  getEmojifromUrl,
  checkHavePermissions,
  returnPermission,
  noInitGuilds,
  noEnabledFunc,
  noHavePermission,
  cleanerDatabase,
  reactionRoleCached,
  statisticsUpdate,
}