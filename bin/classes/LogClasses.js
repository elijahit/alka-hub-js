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
      const Webhook = require('../service/WebhookService');
      const { sendWebhooksEmbedErrorLog, sendWebhooksEmbedLogs } = new Webhook();
      await createLog(guildId, type, reason);
      if(type === 'ERRORE' || type === 'ERRORE-AVVIO') {
        await sendWebhooksEmbedErrorLog(`Errore: ${reason}`, [guildId, type]);
      } else {
        await sendWebhooksEmbedLogs(`Messaggio: ${reason}`, [guildId, type]);

      }
    } catch (error) {
      console.error('[Errore] Log nella classe createLog non creata:', error);
    }
  }
}

module.exports = LogClasses;