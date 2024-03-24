const language = require('../../languages/languages');
const { readDbAllWith2Params, runDb, readDbWith3Params, readDbWith4Params, readDb, readDbAllWith3Params, readDbAllWithValue, readDbAll } = require('../../bin/database');
const { client } = require('../../bin/client');

async function endDateCheck(endDate) {
  // La data contiene errori
  let regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/202[3-9] [0-2][0-9]:[0-5][0-9]$/;
  if (!regex.test(endDate)) return false;
  if (regex.test(endDate)) {
    let dateHourResolve = endDate.split(" ");
    let dateResolve = dateHourResolve[0].split("/");
    let date = Date.parse(`${dateResolve[1]}/${dateResolve[0]}/${dateResolve[2]} ${dateHourResolve[1]}`);
    let dateNow = Date.now();
    if (date < dateNow) {
      return false;
    } else {
      return true;
    }
  }
}

async function checkGiveawayTiming() {
  checkDatabase = await readDbAll('giveaway_system_container');
  for (const value of checkDatabase) {
    if (!(await endDateCheck(value.endDate))) {
      checkPartecipants = await readDbAllWith3Params('SELECT * FROM giveaway_system_partecipants WHERE guildId = ? AND channelId = ? AND messageId = ?', value.guildId, value.channelId, value.messageId);
      if (checkPartecipants.length > 0) {
        let selectWinner = parseInt((Math.random() * ((checkPartecipants.length) - 0) + 0));
        let winners = checkPartecipants[selectWinner].userId;
        let guild, user;

        // CONTROLLO SE LA GUILDS ESISTE ALTRIMENTI ELIMINO I VALORI
        try {
          guild = await client.guilds.fetch(value.guildId);
          // CONTROLLO SE L'UTENTE ESISTE ALTRIMENTI LO ELIMINO
          try {
            let message;
            user = await guild.members.fetch(winners);
            try {
              message = await guild.messages.fetch(value.messageId);
            } catch {
              await runDb("DELETE FROM giveaway_system_container WHERE guildId = ?", value.guildId);
              await runDb("DELETE FROM giveaway_system_partecipants WHERE guildId = ?", value.guildId);
            }
            // DA COMPLETARE IL MESSAGGIO E TUTTO

          } catch {
            await runDb("DELETE FROM giveaway_system_partecipants WHERE guildId = ? AND userId = ?", value.guildId, winners);
          }
        } catch {
          await runDb("DELETE FROM giveaway_system_container WHERE guildId = ?", value.guildId);
          await runDb("DELETE FROM giveaway_system_partecipants WHERE guildId = ?", value.guildId);
        }

      } else {
        //SE NON CI SONO PARTECIPANTI
        let guild;
        try {
          guild = await client.guilds.fetch(value.guildId);
        } catch {
          await runDb("DELETE FROM giveaway_system_container WHERE guildId = ?", value.guildId);
          await runDb("DELETE FROM giveaway_system_partecipants WHERE guildId = ?", value.guildId);
        }
      }
    }
  }
}

module.exports = {
  endDateCheck,
  checkGiveawayTiming,
}