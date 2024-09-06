const {readDb, runDb} = require("../database");

const checkUsersDb = async (member, guild) => {
  const usersIsPresentDb = await readDb(`SELECT * from users WHERE users_id = ?`, member.id);
  const usersIsPresentOnGuild = await readDb(`SELECT * from users_guilds WHERE users_id = ? AND guilds_id = ?`, member.id, guild.id);
  if(!usersIsPresentOnGuild) {
    await runDb('INSERT INTO users_guilds (users_id, guilds_id) VALUES (?, ?)', member.id, guild.id);
  }
  if(!usersIsPresentDb) {
    await runDb('INSERT INTO users (users_id, name) VALUES (?, ?)', member.id, member.user.username);
  }
}

module.exports = checkUsersDb