const {Guild} = require('../models');


async function findAll() {
  return Guild.findAll().then(v => v);
}


/**
 * @param {string} guildId 
 */
async function findByGuildId(guildId) {
  return Guild.findOne({where: {guild_id: guildId}}).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} guildId 
 * @param {string} language 
 * @param {string} time_zone 
 */
async function create(guildId, language = "EN", time_zone = "Europe/London") {
  return Guild.create({guild_id: guildId, language: language, time_zone: time_zone}).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return Guild.update(objToUpdate, {where: objToCondition}).then(v => v);
}

module.exports = {
  findAll,
  findByGuildId,
  create,
  update
}