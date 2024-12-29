// Code: Log - bin/classes/Log.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file LogClasses.js
 * @module LogClasses
 * @description Contiene i metodi per creare un log sul database
*/




class LogClasses {
  static async createLog(guildId, type, reason) {
    try {
      const { createLog } = require('../service/DatabaseService'); 
      await createLog(guildId, type, reason);
    } catch (error) {
      console.error('Error creating log entry:', error);
    }
  }
}

module.exports = LogClasses;