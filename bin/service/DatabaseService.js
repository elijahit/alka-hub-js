/*
  QUESTO E' UN FILE DI SERVIZIO PER RICHIAMARE I METODI DEI REPOSITORY SENZA CHIAMARE DIRETTAMENTE I REPOSITORY
                            CONTERRA' SOLO I METODI USATI DALL'APPLICAZIONE
*/

const { addUser: addUserGuild } = require('../repository/UserGuild');
// addUserGuild - > Permette di aggiungere un utente rispettando le relazioni (User e Guild)

const { findByUserId: findUserById } = require('../repository/User');
// findUserById -> Permette di cercare un utente tramite discordId

const { findByGuildId: findGuildById, update: updateGuild, create: createGuild } = require('../repository/Guild');
// findGuildById -> Permette di cercare un una guild tramite discordId

const { findByPermissionName } = require('../repository/Permissions');
// findByPermissionName -> Permette di cercare un permesso tramite il suo nome

const { findByHashName, findAllCorrespondenceByHashName } = require('../repository/Hash');
// findByHashName -> Permette di cercare un permesso tramite il suo hashName
// findAllCorrespondenceByHashName -> Permette di cercare un permesso tramite hashName e restituisce tutte le sue corrispondenze della tabella permissions

const { finByRoleId: autoRolesFindByRoleId } = require('../repository/AutoRoles');
// autoRolesFindByRoleId -> Permette di cercare un ruolo nella tabella AutoRoles

const { getFeatureIsEnabled, findById: findFeatureById } = require('../repository/Feature');
// autoRolesFindByRoleId -> Permette di cercare un ruolo nella tabella AutoRoles

const { findByName: findConfigByName } = require('../repository/Config');
// findByName -> Permette di creare una configurazione nella tabella configs tramite il nome

const { update: updateEnabledFeature, create: createEnabledFeature } = require('../repository/GuildEnabledFeature');
// updateEnabledFeature -> Permette di aggiornare la tabella guild_enabled_feature
// createEnabledFeature -> Permette di aggiungere un record sulla tabella guild_enabled_feature

const { findByChannelId: findAutoVoiceByChannelId, create: createAutoVoice, findAll: findAllAutoVoice, findBylId: findAutoVoiceById } = require('../repository/AutoVoice');
// findByChannelId -> Permette di cercare un autoVoice nella tabella auto_voice.


const { findByGuildId: findLogsByGuildId, update: updateLogs, create: createLogs } = require('../repository/LogsSystem');
// findByGuildId -> Permette di cercare una configurazione di LogsSystem nella tabella logs_system.
// updateLogs -> Permette di aggiornare un record nella tabella logs_system
// createLogs -> Permette di creare un record nella tabella logs_system


const { findByGuildIdAndChannelId: findStatistics } = require('../repository/Statistics');




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
  findLogsByGuildId,
  updateLogs,
  createLogs,
  findStatistics
}