const { guildMainId, guildMainChannelsControlsError, emojiGuildId_01 } = require('../config.json');
const { EmbedBuilder } = require('discord.js');
const { readDbWith3Params } = require("../bin/database");
const { readFileSync, readdir, writeFile } = require("fs");

function errorSendControls(error, client, guild_error, system) {
  // LEGGO E AGGIORNO IL FILE DI LOGS
  readdir("./", (_, files) => {
    files.forEach(file => {
      errorResult = new Error(`${system}`, {cause: error});
      
      if (file == "logs.txt") {
        const data = readFileSync('./logs.txt',
          { encoding: 'utf8', flag: 'r' });

        writeFile("./logs.txt", `${data}\n\
---- [START LOGS] ----\n\
[${errorResult.message}]\n\
${errorResult.cause}\n\
${errorResult.stack}\n\
----- [END LOGS] -----\n`, {
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
    })
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

module.exports = {
  errorSendControls,
  getEmoji,
  getEmojifromUrl,
  checkHavePermissions,
  returnPermission,
  noInitGuilds,
  noEnabledFunc,
  noHavePermission,
}