// Code: languages - languages/languages.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
// Description: Questo file contiene un metodo per verificare la lingua di un server tramite il suo ID

const { findGuildById } = require('../bin/service/DatabaseService');

async function databaseCheck (guildId, variables) {
  try {
    let result = await findGuildById(guildId, variables);
    if(!result) return "EN";
    
    return result.get({plain: true}).language;
  } catch {
    return "EN"
  }
}

module.exports = {
  databaseCheck
}