// Code: DatabaseService - bin/service/DatabaseService.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file DatabaseService.js
 * @module DatabaseService
 * @description Contiene i metodi per richiamare i repository
 * @see repository
 */

const { addUser: addUserGuild } = require('../repository/UserGuild');
// addUserGuild - > Permette di aggiungere un utente rispettando le relazioni (User e Guild)

const { findByUserId: findUserById } = require('../repository/User');
// findUserById -> Permette di cercare un utente tramite discordId

const { findByGuildId: findGuildById, 
  update: updateGuild, 
  create: createGuild } = require('../repository/Guild');
// findGuildById -> Permette di cercare un una guild tramite discordId

const { findByPermissionName } = require('../repository/Permissions');
// findByPermissionName -> Permette di cercare un permesso tramite il suo nome

const { findByHashName, 
  findAllCorrespondenceByHashName } = require('../repository/Hash');
// findByHashName -> Permette di cercare un permesso tramite il suo hashName
// findAllCorrespondenceByHashName -> Permette di cercare un permesso tramite hashName e restituisce tutte le sue corrispondenze della tabella permissions

const { finByRoleId: autoRolesFindByRoleId } = require('../repository/AutoRoles');
// autoRolesFindByRoleId -> Permette di cercare un ruolo nella tabella AutoRoles

const { getFeatureIsEnabled, 
  findById: findFeatureById } = require('../repository/Feature');
// autoRolesFindByRoleId -> Permette di cercare un ruolo nella tabella AutoRoles

const { findByName: findConfigByName } = require('../repository/Config');
// findByName -> Permette di creare una configurazione nella tabella configs tramite il nome

const { update: updateEnabledFeature, 
  create: createEnabledFeature } = require('../repository/GuildEnabledFeature');
// updateEnabledFeature -> Permette di aggiornare la tabella guild_enabled_feature
// createEnabledFeature -> Permette di aggiungere un record sulla tabella guild_enabled_feature

const { findByChannelId: findAutoVoiceByChannelId, 
  create: createAutoVoice, 
  findAll: findAllAutoVoice, 
  findBylId: findAutoVoiceById, 
  remove: removeAutoVoiceById, 
  findAllbyGuild: findAllAutoVoiceByGuild } = require('../repository/AutoVoice');
// findByChannelId -> Permette di cercare un autoVoice nella tabella auto_voice.
// createAutoVoice -> Permette di creare un autoVoice nella tabella auto_voice.
// findAllAutoVoice -> Permette di cercare tutti gli autoVoice nella tabella auto_voice.
// findAutoVoiceById -> Permette di cercare un autoVoice nella tabella auto_voice tramite l'id.
// removeAutoVoiceById -> Permette di rimuovere un autoVoice nella tabella auto_voice tramite l'id.
// findAllAutoVoiceByGuild -> Permette di cercare tutti gli autoVoice nella tabella auto_voice tramite l'id della guild.


const { findByGuildId: findLogsByGuildId, 
  update: updateLogs, 
  create: createLogs } = require('../repository/LogsSystem');
// findByGuildId -> Permette di cercare una configurazione di LogsSystem nella tabella logs_system.
// updateLogs -> Permette di aggiornare un record nella tabella logs_system
// createLogs -> Permette di creare un record nella tabella logs_system


const { findByGuildIdAndChannelId: findStatistics } = require('../repository/Statistics');
// findByGuildIdAndChannelId -> Permette di cercare una configurazione di Statistics nella tabella statistics

const {findByGuildId: findLevelsConfigByGuildId, 
  findAll: findLevelsConfigAll, 
  create: createLevelsConfig, 
  update: updateLevelsConfig, 
  findByGuildIdAndChannelId: findLevelsConfigByGuildIdAndChannelId } = require('../repository/LevelsConfig'); 
// findLevelsConfigByGuildId -> Permette di cercare una configurazione di LevelsConfig nella tabella levels_config
// findLevelsConfigAll -> Permette di cercare tutte le configurazioni di LevelsConfig nella tabella levels_config
// createLevelsConfig -> Permette di creare una configurazione di LevelsConfig nella tabella levels_config
// updateLevelsConfig -> Permette di aggiornare una configurazione di LevelsConfig nella tabella levels_config
// findLevelsConfigByGuildIdAndChannelId -> Permette di cercare una configurazione di LevelsConfig nella tabella levels_config tramite guildId e channelId


const { findAll: findAllLevels, 
  findByGuildId: findByGuildIdLevel, 
  findByGuildIdAndUserId: findByGuildIdAndUserIdLevel, 
  create: createLevel, 
  update: updateLevel } = require('../repository/Level');
// findAllLevels -> Permette di cercare tutte le configurazioni di Level nella tabella levels
// findByGuildIdLevel -> Permette di cercare una configurazione di Level nella tabella levels tramite guildId
// findByGuildIdAndUserIdLevel -> Permette di cercare una configurazione di Level nella tabella levels tramite guildId e userId
// createLevel -> Permette di creare una configurazione di Level nella tabella levels
// updateLevel -> Permette di aggiornare una configurazione di Level nella tabella levels

const { findAll: findAllLevelsRoles,
  findByGuildId: findByGuildIdLevelsRoles,
  findByGuildIdAndRoleId: findByGuildIdAndRoleIdLevelsRoles,
  create: createLevelsRoles,
  update: updateLevelsRoles } = require('../repository/LevelsRoles');
// findAllLevelsRoles -> Permette di cercare tutte le configurazioni di LevelsRoles nella tabella levels_roles
// findByGuildIdLevelsRoles -> Permette di cercare una configurazione di LevelsRoles nella tabella levels_roles tramite guildId
// findByGuildIdAndRoleIdLevelsRoles -> Permette di cercare una configurazione di LevelsRoles nella tabella levels_roles tramite guildId e roleId
// createLevelsRoles -> Permette di creare una configurazione di LevelsRoles nella tabella levels_roles
// updateLevelsRoles -> Permette di aggiornare una configurazione di LevelsRoles nella tabella levels_roles



(async () => {

})()


module.exports = {
  addUserGuild,
  findUserById,
  findGuildById,
  findByPermissionName,
  findByHashName,
  findAllCorrespondenceByHashName,
  autoRolesFindByRoleId,
  getFeatureIsEnabled,
  findConfigByName,
  findFeatureById,
  updateEnabledFeature,
  createEnabledFeature,
  updateGuild,
  createGuild,
  findAutoVoiceByChannelId,
  createAutoVoice,
  findAllAutoVoice,
  findAutoVoiceById,
  removeAutoVoiceById,
  findAllAutoVoiceByGuild,
  findLogsByGuildId,
  updateLogs,
  createLogs,
  findStatistics,
  findLevelsConfigByGuildId,
  findLevelsConfigAll,
  createLevelsConfig,
  updateLevelsConfig,
  findLevelsConfigByGuildIdAndChannelId,
  findAllLevels,
  findByGuildIdLevel,
  findByGuildIdAndUserIdLevel,
  createLevel,
  updateLevel,
  findAllLevelsRoles,
  findByGuildIdLevelsRoles,
  findByGuildIdAndRoleIdLevelsRoles,
  createLevelsRoles,
  updateLevelsRoles
}