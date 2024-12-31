// Code: HandlingFunctions - bin/HandlingFunctions.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file HandlingFunctions.js
 * @module HandlingFunctions
 * @description Contiene i metodi per la gestione degli errori e delle funzioni di controllo
 */

const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { readFileSync, readdir, writeFile } = require("fs");
const { stripIndents } = require('common-tags');
const colors = require('./data/colors');
const emoji = require('./data/emoji');
const LogClasses = require('./classes/LogClasses');

function errorSendControls(error, client, guild_error, system, variables) {
  console.error(error);
  if (error == "DiscordAPIError[50013]: Missing Permissions") {
    LogClasses.createLog(guild_error.id, 'ERRORE-PERMISSIONS', `Errore: ${error} / ${system}`, variables);
    guild_error.channels.fetch()
      .then(channels => {
        let MissingMessage = false;
        channels.each(channel => {
          if (!MissingMessage) {
            if (channel.type == 0) {
              const embedLog = new EmbedBuilder()
                .setAuthor({ name: `${variables.getBotName()} | Missing Permissions` })
                .setDescription(`You haven't invited ${variables.getBotName()} correctly and you don't have permission to perform this action. We invite you to invite ${variables.getBotName()} again or contact our support.`)
                .setFooter({ text: `${variables.getBotFooter()}`, iconURL: variables.getBotFooterIcon() })
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

      if (file == "logs.log") {
        const data = readFileSync('./logs.log',
          { encoding: 'utf8', flag: 'r' });

        writeFile("./logs.log", stripIndents`${data}\n\
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
          console.log("[ERRORE] visualizza logs.log per capire di che si tratta");
        }
          });
      }
    }
  })

  LogClasses.createLog(guild_error.id, 'ERRORE-CONTROLS', `${error} | ${system}`, variables);

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

async function noInitGuilds(interaction, variables) {
  let customEmoji = emoji.general.errorMarker;
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `${variables.getBotName()} | Init Controls`, iconURL: customEmoji })
    .setDescription("You can't execute this command at the moment. You need to initialize bot first with **/init**")
    .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
    .setColor(colors.general.error);
  return await interaction.reply({ embeds: [embedLog], ephemeral: true });
}

async function noEnabledFunc(interaction, language, variables) {
  let customEmoji = emoji.general.errorMarker;
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `${variables.getBotName()} | Features Controls`, iconURL: customEmoji })
    .setDescription(language)
    .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
    .setColor(colors.general.error);
  return await interaction.reply({ embeds: [embedLog], ephemeral: true });
}

async function noHavePermission(interaction, language, variables) {
  let customEmoji = emoji.general.errorMarker;
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `${variables.getBotName()} | Missing Permissions`, iconURL: customEmoji })
    .setDescription(language.noPermission.description_embed)
    .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
    .setColor(colors.general.error);

  await interaction.reply({ embeds: [embedLog], ephemeral: true });
}


module.exports = {
  errorSendControls,
  checkHavePermissions,
  returnPermission,
  noInitGuilds,
  noEnabledFunc,
  noHavePermission,
}