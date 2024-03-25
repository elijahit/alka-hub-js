const language = require('../../languages/languages');
const { readDbAllWith2Params, runDb, readDbWith3Params, readDbWith4Params, readDb, readDbAllWith3Params, readDbAllWithValue, readDbAll } = require('../../bin/database');
const { readFileSync, read } = require('fs');
const { client } = require('../../bin/client');
const { getEmojifromUrl } = require('../../bin/HandlingFunctions');
const { EmbedBuilder } = require('discord.js');

async function endDateCheck(endDate, guild) {
  const config = await readDb('SELECT * FROM guilds_config WHERE guildId = ?', guild);
  let localTimeNowResolve;
  if (config?.timeZone?.includes("+")) {
    localTimeNowResolve = new Date(Date.now() + (3600000 * parseInt(config.timeZone)));
  } else if (config?.timeZone?.includes("-")) {
    localTimeNowResolve = new Date(Date.now() - (3600000 * parseInt(config.timeZone.split("-")[1])));
  } else {
    localTimeNowResolve = new Date(Date.now());
  }

  // La data contiene errori
  let regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/202[3-9] [0-2][0-9]:[0-5][0-9]$/;
  if (!regex.test(endDate)) return false;
  if (regex.test(endDate)) {
    let dateHourResolve = endDate.split(" ");
    let dateResolve = dateHourResolve[0].split("/");
    let date = Date.parse(`${dateResolve[2]}-${dateResolve[1]}-${dateResolve[0]}T${dateHourResolve[1]}:00.000Z`);
    if (date < localTimeNowResolve.getTime()) {
      return false;
    } else {
      return true;
    }
  }
}
async function theWinnersCheker(winnersCount, checkPartecipants) {
  let theWinners = [];
  let counter = winnersCount > checkPartecipants.length ? checkPartecipants.length : winnersCount;
  if (checkPartecipants.length > 0) {
    for (let i = 1; i <= counter; i++) {
      let selectWinner = parseInt((Math.random() * ((checkPartecipants.length) - 0) + 0));
      let userId = checkPartecipants[selectWinner].userId;
      if (!theWinners.includes(checkPartecipants[selectWinner].userId)) {
        theWinners.push(userId);
      } else {
        i--;
      }
      if (theWinners.length == counter) {
        return theWinners;
      }
    }
  } else {
    return null;
  }
}

async function checkGiveawayTiming() {
  checkDatabase = await readDbAll('giveaway_system_container');
  for (const value of checkDatabase) {
    if (!(await endDateCheck(value.endDate, value.guildId))) {
      // RECUPERO LA LINGUA
      let data = await language.databaseCheck(value.guildId);
      const langagues_path = readFileSync(`./languages/giveaway-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      checkPartecipants = await readDbAllWith3Params('SELECT * FROM giveaway_system_partecipants WHERE guildId = ? AND channelId = ? AND messageId = ?', value.guildId, value.channelId, value.messageId);
      let winnersCount = value.winners;

      let theWinners = await theWinnersCheker(winnersCount, checkPartecipants);
      let guild;

      // CONTROLLO SE LA GUILDS ESISTE ALTRIMENTI ELIMINO I VALORI
      try {
        guild = await client.guilds.fetch(value.guildId);
        // CONTROLLO SE L'UTENTE ESISTE ALTRIMENTI LO ELIMINO
        try {
          let theWinnersString = "";
          let channel = await guild.channels.fetch(value.channelId);
          let message = await channel.messages.fetch(value.messageId);
          const customEmoji = await getEmojifromUrl(client, "giveaway");
          if (theWinners) {
            for await (const value of theWinners) {
              theWinnersString += `<@${value}>\n`;
              try {
                let user = await guild.members.fetch(value);
                const embedLog = new EmbedBuilder()
                  .setAuthor({ name: `${language_result.giveawayUserContact.embed_title}`, iconURL: customEmoji })
                  .setDescription(language_result.giveawayUserContact.description_embed
                    .replace("{0}", `${message.url}`))
                  .setFooter({ text: `${language_result.giveawayUserContact.embed_footer}`, iconURL: `${language_result.giveawayUserContact.embed_icon_url}` })
                  .setColor(0xa22297);
                await user.send({ embeds: [embedLog] });
              }
              catch (error) {
                console.log(error)
                //Passa
              }
            }
          }

          // MODIFICO IL MESSAGGIO ASSEGNANDOGLI IL VINCITORE
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.giveawayStart.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.giveawayStart.description_embed
              .replace("{0}", value.prizes)
              .replace("{1}", value.endDate)
              .replace("{2}", value.slots > 0 ? `${value.slots}` : language_result.giveawayStart.slotsInfinity)
              .replace("{3}", `${value.winners}`))
            .setFooter({ text: `${language_result.giveawayStart.embed_footer}`, iconURL: `${language_result.giveawayStart.embed_icon_url}` })
            .addFields([{ name: language_result.giveawayStart.embed_winners, value: (theWinners != null ? theWinnersString : language_result.giveawayStart.noWinners) }])
            .setColor(0xa22297);
          await message.edit({ embeds: [embedLog], components: [] });

          await runDb("DELETE FROM giveaway_system_container WHERE guildId = ? AND messageId = ?", value.guildId, value.messageId);
          await runDb("DELETE FROM giveaway_system_partecipants WHERE guildId = ? AND messageId = ?", value.guildId, value.messageId);
        } catch (error) {
          
          await runDb("DELETE FROM giveaway_system_partecipants WHERE guildId = ? AND messageId = ?", value.guildId, value.messageId);
        }
      } catch (error) {
        
        await runDb("DELETE FROM giveaway_system_container WHERE guildId = ? AND messageId = ?", value.guildId, value.messageId);
        await runDb("DELETE FROM giveaway_system_partecipants WHERE guildId = ? AND messageId = ?", value.guildId, value.messageId);
      }
    }
  }
}

module.exports = {
  endDateCheck,
  checkGiveawayTiming,
}