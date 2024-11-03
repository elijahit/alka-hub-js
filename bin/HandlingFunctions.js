const { guildMainId, guildMainChannelsControlsError, emojiGuildId_01 } = require('../config.json');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { readDbWith3Params, readDb, readDbAll, runDb, readDbAllWith2Params, readDbAllWithValue } = require("../bin/database");
const { readFileSync, readdir, writeFile } = require("fs");
const { stripIndents } = require('common-tags');
const colors = require('./data/colors');
const emoji = require('./data/emoji');

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
                .setDescription("You haven't invited Alka Hub correctly and you don't have permission to perform this action. We invite you to invite Alka Hub again or contact our [support discord](https://discord.gg/DqRcKB75N5).\n\n-> [Invite Again](https://discord.com/api/oauth2/authorize?client_id=843183839869665280&permissions=8&scope=bot+applications.commands)")
                .setFooter({ text: `Alka Hub di alkanetwork.eu`, iconURL: emoji.general.appIcon })
                .setColor(colors.general.error);
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
            .setColor(colors.general.error)
            .setImage(`https://cdn.discordapp.com/icons/${guild_error.id}/${guild_error.icon}.png`);
          channel.send({ embeds: [embedLog] });
        })
    })
}

async function checkHavePermissions(interaction, pex) {
  const member = interaction.member;
  // TODO DA SISTEMARE CON IL SISTEMA DI PERMESSI
  // let checkSqlRole = `SELECT * FROM rank_system_permissions WHERE guildId = ? AND roleId = ? AND hashRank = ?`;
  let check = false, admin = false;
  for (role of member.roles.cache) {
    // TODO DA SISTEMARE CON IL SISTEMA DI PERMESSI
    // const result = await readDbWith3Params(checkSqlRole, member.guild.id, role[1].id, pex);
    const result = null;
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
  let customEmoji = emoji.general.errorMarker;
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `Alka Hub | Init Controls`, iconURL: customEmoji })
    .setDescription("You can't execute this command at the moment. You need to initialize Alka first with **/init**")
    .setFooter({ text: `Alka Hub by alkanetwork.eu`, iconURL: `https://cdn.discordapp.com/app-icons/843183839869665280/6bafa96797abd3b0344721c58d6e5502.png` })
    .setColor(colors.general.error);
  return await interaction.reply({ embeds: [embedLog], ephemeral: true });
}

async function noEnabledFunc(interaction, language) {
  let customEmoji = emoji.general.errorMarker;
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `Alka Hub | Features Controls`, iconURL: customEmoji })
    .setDescription(language)
    .setFooter({ text: `Alka Hub by alkanetwork.eu`, iconURL: `https://cdn.discordapp.com/app-icons/843183839869665280/6bafa96797abd3b0344721c58d6e5502.png` })
    .setColor(colors.general.error);
  return await interaction.reply({ embeds: [embedLog], ephemeral: true });
}

async function noHavePermission(interaction, language) {
  let customEmoji = emoji.general.errorMarker;
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `${language.noPermission.embed_title}`, iconURL: customEmoji })
    .setDescription(language.noPermission.description_embed)
    .setFooter({ text: `${language.noPermission.embed_footer}`, iconURL: `${language.noPermission.embed_icon_url}` })
    .setColor(colors.general.error);

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


module.exports = {
  errorSendControls,
  checkHavePermissions,
  returnPermission,
  noInitGuilds,
  noEnabledFunc,
  noHavePermission,
  cleanerDatabase,
  reactionRoleCached,
}