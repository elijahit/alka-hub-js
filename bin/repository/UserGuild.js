const {UserGuild} = require('../models/UserGuild');
const User = require('../repository/User');
const Guild = require('../repository/Guild');


/**
 * @param {string} userId
 * @param {string} guildId 
 * @param {string} username 
 */
async function addUser(userId, guildId, username) {
  try {
    const user = await User.findByUserId(userId);
    const guild = await Guild.findByGuildId(guildId);

    if (!user) {
      await User.create(userId, username);
    }
    if (!guild) {
      await Guild.create(guildId);
    }

    await UserGuild.create({user_id: userId, guild_id: guildId});

  } catch (error) {
    console.error('[addUser] Repository UserGuild: ', error);
  }
}

async function findAll() {
  return UserGuild.findAll();
}

module.exports = {
  addUser,
  findAll,
}