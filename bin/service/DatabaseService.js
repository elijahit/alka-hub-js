/*
  QUESTO E' UN FILE DI SERVIZIO PER RICHIAMARE I METODI DEI REPOSITORY SENZA CHIAMARE DIRETTAMENTE I REPOSITORY
                            CONTERRA' SOLO I METODI USATI DALL'APPLICAZIONE
*/

const { addUser: addUserGuild } = require('../repository/UserGuild');
const { findByUserId: findUserById } = require('../repository/User');
const { findByGuildId: findGuildById } = require('../repository/Guild');



module.exports = {
  addUserGuild,
  findUserById,
  findGuildById
}