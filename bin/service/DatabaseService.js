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
  findAllbyGuild: findAllAutoVoiceByGuildId } = require('../repository/AutoVoice');
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

const {findByGuildId: findLevelsConfigByGuildId, 
  findAll: findLevelsConfigAll, 
  create: createLevelsConfig, 
  update: updateLevelsConfig, 
  findByGuildIdAndChannelId: findLevelsConfigByGuildIdAndChannelId,
  remove: removeLevelsConfig } = require('../repository/LevelsConfig'); 
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
  findAllByGuildId: findAllLevelsRolesByGuildId,
  create: createLevelsRoles,
  update: updateLevelsRoles,
  remove: removeLevelsRoles } = require('../repository/LevelsRoles');
// findAllLevelsRoles -> Permette di cercare tutte le configurazioni di LevelsRoles nella tabella levels_roles
// findByGuildIdLevelsRoles -> Permette di cercare una configurazione di LevelsRoles nella tabella levels_roles tramite guildId
// findByGuildIdAndRoleIdLevelsRoles -> Permette di cercare una configurazione di LevelsRoles nella tabella levels_roles tramite guildId e roleId
// createLevelsRoles -> Permette di creare una configurazione di LevelsRoles nella tabella levels_roles
// updateLevelsRoles -> Permette di aggiornare una configurazione di LevelsRoles nella tabella levels_roles
// removeLevelsRoles -> Permette di rimuovere una configurazione di LevelsRoles nella tabella levels_roles

const {
  findAll: findAllRoles,
  findByGuildId: findByGuildIdRole,
  create: createRole,
  update: updateRole
} = require('../repository/Role');
// findAllRoles -> Permette di cercare tutte le configurazioni di Role nella tabella roles
// findByGuildIdRole -> Permette di cercare una configurazione di Role nella tabella roles tramite guildId
// createRole -> Permette di creare una configurazione di Role nella tabella roles
// updateRole -> Permette di aggiornare una configurazione di Role nella tabella roles

const {
  findAll: findAllReactions,
  findByGuildId: findByGuildIdReactions,
  findByGuildIdAndMessageId: findByGuildIdAndMessageIdReactions,
  create: createReaction,
  update: updateReaction,
  findByGuildIdAndMessageIdAndEmojiAndRoleId: findByGuildIdAndMessageIdAndEmojiAndRoleReactions,
  findAllByGuildId: findAllReactionsByGuildId,
  findByGuildIdAndMessageIdAndEmoji: findByGuildIdAndMessageIdAndEmojiReactions,
  remove: removeReactions
} = require('../repository/ReactionRole');
// findAllReactions -> Permette di cercare tutte le configurazioni di ReactionRole nella tabella reaction_roles
// findByGuildIdReactions -> Permette di cercare una configurazione di ReactionRole nella tabella reaction_roles tramite guildId
// findByGuildIdAndMessageIdReactions -> Permette di cercare una configurazione di ReactionRole nella tabella reaction_roles tramite guildId e messageId
// createReaction -> Permette di creare una configurazione di ReactionRole nella tabella reaction_roles
// updateReaction -> Permette di aggiornare una configurazione di ReactionRole nella tabella reaction_roles
// findByGuildIdAndMessageIdAndEmojiAndRoleReactions -> Permette di cercare una configurazione di ReactionRole nella tabella reaction_roles tramite guildId, messageId, emoji e roleId
// findAllReactionsByGuildId -> Permette di cercare tutte le configurazioni di ReactionRole nella tabella reaction_roles tramite guildId
// findByGuildIdAndMessageIdAndEmojiReactions -> Permette di cercare una configurazione di ReactionRole nella tabella reaction_roles tramite guildId, messageId e emoji
// removeReactions -> Permette di rimuovere una configurazione di ReactionRole nella tabella reaction_roles

const {
  findAll: findAllWelcome,
  findByGuildIdAndChannelId: findByGuildIdAndChannelIdWelcome,
  findByGuildId: findByGuildIdWelcome,
  create: createWelcome,
  update: updateWelcome
} = require('../repository/Welcome');
// findAllWelcome -> Permette di cercare tutte le configurazioni di Welcome nella tabella welcome
// findByGuildIdAndChannelIdWelcome -> Permette di cercare una configurazione di Welcome nella tabella welcome tramite guildId e channelId
// findByGuildIdWelcome -> Permette di cercare una configurazione di Welcome nella tabella welcome tramite guildId
// createWelcome -> Permette di creare una configurazione di Welcome nella tabella welcome
// updateWelcome -> Permette di aggiornare una configurazione di Welcome nella tabella welcome

const {
  findAll: findAllStatistics,
  findAllByGuildId: findAllByGuildIdStatistics,
  findByGuildIdAndChannelId: findByGuildIdAndChannelIdStatistics,
  create: createStatistics,
  update: updateStatistics,
  remove: removeStatistics,
  findById: findStatisticsById
} = require('../repository/Statistics');
// findAllStatistics -> Permette di cercare tutte le configurazioni di Statistics nella tabella statistics
// findByGuildIdAndChannelIdStatistics -> Permette di cercare una configurazione di Statistics nella tabella statistics tramite guildId e channelId
// createStatistics -> Permette di creare una configurazione di Statistics nella tabella statistics
// updateStatistics -> Permette di aggiornare una configurazione di Statistics nella tabella statistics


const {
  findAll: findAllStatisticsCategory,
  findAllByGuildId: findAllByGuildIdStatisticsCategory,
  findByGuildIdAndcategoryId: findByGuildIdAndcategoryIdStatisticsCategory,
  create: createStatisticsCategory,
  update: updateStatisticsCategory
} = require('../repository/StatisticsCategory');
// findAllStatisticsCategory -> Permette di cercare tutte le configurazioni di StatisticsCategory nella tabella statistics_category
// findByGuildIdAndcategoryIdStatisticsCategory -> Permette di cercare una configurazione di StatisticsCategory nella tabella statistics_category tramite guildId e categoryId
// createStatisticsCategory -> Permette di creare una configurazione di StatisticsCategory nella tabella statistics_category
// updateStatisticsCategory -> Permette di aggiornare una configurazione di StatisticsCategory nella tabella statistics_category



module.exports = {
  findAllWelcome,
  findByGuildIdAndChannelIdWelcome,
  findByGuildIdWelcome,
  createWelcome,
  updateWelcome,
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
  findAllAutoVoiceByGuildId,
  findLogsByGuildId,
  updateLogs,
  createLogs,
  findLevelsConfigByGuildId,
  findLevelsConfigAll,
  createLevelsConfig,
  updateLevelsConfig,
  removeLevelsConfig,
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
  updateLevelsRoles,
  removeLevelsRoles,
  findAllLevelsRolesByGuildId,
  findAllRoles,
  findByGuildIdRole,
  createRole,
  updateRole,
  findAllReactions,
  findByGuildIdReactions,
  findByGuildIdAndMessageIdReactions,
  createReaction,
  updateReaction,
  findByGuildIdAndMessageIdAndEmojiAndRoleReactions,
  findAllReactionsByGuildId,
  findByGuildIdAndMessageIdAndEmojiReactions,
  removeReactions,
  findAllStatistics,
  findByGuildIdAndChannelIdStatistics,
  createStatistics,
  updateStatistics,
  findAllStatisticsCategory,
  findAllByGuildIdStatisticsCategory,
  findByGuildIdAndcategoryIdStatisticsCategory,
  createStatisticsCategory,
  updateStatisticsCategory,
  findAllByGuildIdStatistics,
  removeStatistics,
  findStatisticsById
}