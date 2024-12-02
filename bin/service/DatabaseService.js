/*
  QUESTO E' UN FILE DI SERVIZIO PER RICHIAMARE I METODI DEI REPOSITORY SENZA CHIAMARE DIRETTAMENTE I REPOSITORY
                            CONTERRA' SOLO I METODI USATI DALL'APPLICAZIONE
*/

const { addUser: addUserGuild } = require('../repository/UserGuild');
const { findByUserId: findUserById } = require('../repository/User');
const { findByGuildId: findGuildById } = require('../repository/Guild');
const { findByPermissionName } = require('../repository/Permissions');
const { findByHashName, findAllCorrespondenceByHashName } = require('../repository/Hash');

findAllCorrespondenceByHashName("features").then(v => console.log(v)); // <- da fixare

module.exports = {
  addUserGuild,
  findUserById,
  findGuildById,
  findByPermissionName,
  findByHashName,
  findAllCorrespondenceByHashName
}