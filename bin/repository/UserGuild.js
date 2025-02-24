// Code: UserGuild - bin/repository/UserGuild.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file UserGuild.js
 * @module UserGuild
 * @description Contiene i metodi per richiamare la tabella UserGuild
 */

const {UserGuild} = require('../models');
const User = require('../repository/User');
const Guild = require('../repository/Guild');
const { Model } = require('sequelize');


/**
 * @param {string} userId
 * @param {string} guildId 
 * @param {string} username 
 * @returns {Promise<void>}
 */
async function addUser(userId, guildId, username, variables) {
  try {
    const user = await User.findByUserId(userId);
    const guild = await Guild.findByGuildId(guildId, variables);

    if (!user) {
      await User.create(userId, username);
    }
    if (!guild) {
      await Guild.create(guildId, "EN", "Europe/London", variables);
    }

    const userGuild = await UserGuild.findOne({where: {user_id: userId, guild_id: guildId}});

    if(!userGuild) await UserGuild.create({user_id: userId, guild_id: guildId});

  } catch (error) {
    console.error('[addUser] Repository UserGuild: ', error);
  }
}

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await UserGuild.findAll();
}

module.exports = {
  addUser,
  findAll,
}