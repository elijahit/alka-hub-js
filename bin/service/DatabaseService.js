/*
  QUESTO E' UN FILE DI SERVIZIO PER RICHIAMARE I METODI DEI REPOSITORY SENZA CHIAMARE DIRETTAMENTE I REPOSITORY
                            CONTERRA' SOLO I METODI USATI DALL'APPLICAZIONE
*/

const { addUser: addUserGuild } = require('../repository/UserGuild');
// addUserGuild - > Permette di aggiungere un utente rispettando le relazioni (User e Guild)

const { findByUserId: findUserById } = require('../repository/User');
// findUserById -> Permette di cercare un utente tramite discordId

const { findByGuildId: findGuildById } = require('../repository/Guild');
// findGuildById -> Permette di cercare un una guild tramite discordId

const { findByPermissionName } = require('../repository/Permissions');
// findByPermissionName -> Permette di cercare un permesso tramite il suo nome

const { findByHashName, findAllCorrespondenceByHashName } = require('../repository/Hash');
// findByHashName -> Permette di cercare un permesso tramite il suo hashName
// findAllCorrespondenceByHashName -> Permette di cercare un permesso tramite hashName e restituisce tutte le sue corrispondenze della tabella permissions


module.exports = {
  addUserGuild,
  findUserById,
  findGuildById,
  findByPermissionName,
  findByHashName,
  findAllCorrespondenceByHashName
}