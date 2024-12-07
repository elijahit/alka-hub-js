const {AutoVoice, Guild} = require('../models');
const Variables = require('../classes/GlobalVariables');



async function findAll() {
  return await AutoVoice.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @param {string} channelId 
 */
async function findByChannelId(guildId, channelId) {
  return await AutoVoice.findOne({where: {channel_id: channelId, guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} roleId 
 */
async function create(guildId, type, categoryId, nickname) {
  return await AutoVoice.create({guild_id: guildId, type: type, channel_id: categoryId, nickname: nickname, config_id: Variables.getConfigId()});
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return await AutoVoice.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByChannelId,
  create,
  update
}