const {UserGuild} = require('../models/UserGuild');
const {User} = require('../models/User');
const {Guild} = require('../models/Guild');


/**
 * @param {string} userId
 * @param {string} guildId 
 * @param {string} username 
 */
async function addUser(userId, guildId, username) {
  try {
    const user = await User.findOne({where: {user_id: userId}});
    const guild = await Guild.findOne({where: {guild_id: guildId}});

    if (!user) {
      await User.create({user_id: userId, name: username});
    }
    if (!guild) {
      await Guild.create({guild_id: guildId, language: "EN", time_zone: "Europe/London"});
    }

    await UserGuild.create({user_id: userId, guild_id: guildId});

  } catch (error) {
    console.error('[addUser] Repository UserGuild: ', error);
  }
}

module.exports = {
  addUser,
}