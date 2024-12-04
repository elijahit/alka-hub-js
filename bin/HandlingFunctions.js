const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { readDbWith3Params, readDb, readDbAll, runDb, readDbAllWith2Params, readDbAllWithValue } = require("../bin/database");
const { readFileSync, readdir, writeFile } = require("fs");
const { stripIndents } = require('common-tags');
const colors = require('./data/colors');
const emoji = require('./data/emoji');
const Variables = require('./classes/GlobalVariables');

function errorSendControls(error, client, guild_error, system) {
  console.error(error);
  if (error == "DiscordAPIError[50013]: Missing Permissions") {
    return guild_error.channels.fetch()
      .then(channels => {
        let MissingMessage = false;
        channels.each(channel => {
          if (!MissingMessage) {
            if (channel.type == 0) {
              const embedLog = new EmbedBuilder()
                .setAuthor({ name: `${Variables.getBotName()} | Missing Permissions` })
                .setDescription(`You haven't invited ${Variables.getBotName()} correctly and you don't have permission to perform this action. We invite you to invite ${Variables.getBotName()} again or contact our [support discord](https://discord.gg/DqRcKB75N5).`)
                .setFooter({ text: `${Variables.getBotFooter}`, iconURL: Variables.getBotFooterIcon() })
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
  const guildMain = Variables.getGuildMainId();
  const channelError = Variables.getChannelError();
  if(!guildMain || !channelError) return;
  client.guilds.fetch(guildMain)
    .then(guild => {
      guild.channels.fetch(channelError)
        .then(channel => {
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${Variables.getBotName()} - ${Variables.getNameConfiguration()} | Controls Error ❌` })
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
    .setAuthor({ name: `${Variables.getBotName()} | Init Controls`, iconURL: customEmoji })
    .setDescription("You can't execute this command at the moment. You need to initialize bot first with **/init**")
    .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
    .setColor(colors.general.error);
  return await interaction.reply({ embeds: [embedLog], ephemeral: true });
}

async function noEnabledFunc(interaction, language) {
  let customEmoji = emoji.general.errorMarker;
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `${Variables.getBotName()} | Features Controls`, iconURL: customEmoji })
    .setDescription(language)
    .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
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


module.exports = {
  errorSendControls,
  checkHavePermissions,
  returnPermission,
  noInitGuilds,
  noEnabledFunc,
  noHavePermission,
}