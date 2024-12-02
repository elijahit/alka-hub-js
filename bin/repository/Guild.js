const {Guild} = require('../models/Guild');


async function findAll() {
  return Guild.findAll();
}


/**
 * @param {string} guildId 
 */
async function findByGuildId(guildId) {
  return Guild.findOne({where: {guild_id: guildId}});
}

/**
 * 
 * @param {string} guildId 
 * @param {string} language 
 * @param {string} time_zone 
 */
async function create(guildId, language = "EN", time_zone = "Europe/London") {
  return Guild.create({guild_id: guildId, language: language, time_zone: time_zone})
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return Permissions.update(objToUpdate, {where: objToCondition})
}

module.exports = {
  findAll,
  findByGuildId,
  create,
  update
}