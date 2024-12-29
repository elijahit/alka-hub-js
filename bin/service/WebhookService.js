// Code: WebhookService - bin/service/WebhookService.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file WebhookService.js
 * @module WebhookService
 * @description Contiene i metodi per inviare i webhook
*/

const {WebhookClient, EmbedBuilder} = require('discord.js');
const color = require('../data/colors');
const webhook = require('../data/webhooks');
const Variables = require('../classes/GlobalVariables');

class WebhookService {
  constructor() {
    // Initialize any required properties here
  }

  async sendWebhooksEmbedErrorLog(message, others) {
    try {
      const webhookClient = new WebhookClient({ url: webhook.error });
      const embed = new EmbedBuilder()
      .setTitle(`Alka Webhook | Errore - (${Variables.getConfigId()}) ${Variables.getNameConfiguration()}`) 
      .setColor(color.general.error)
      .setDescription(message)
      .setFields({name: 'Guild ID', value: others[0], inline: true}, {name: 'Type', value: others[1], inline: true});
      await webhookClient.send({username: "Alka Webhook", embeds: [embed] });

    } catch (error) {
      console.error('[ERRORE] Errore durante l\'invio del webhook:', error);
      throw error;
    }
  }

  async sendWebhooksEmbedLogs(message, others) {
    try {
      const webhookClient = new WebhookClient({ url: webhook.general });
      const embed = new EmbedBuilder()
      .setTitle(`Alka Webhook | Logs - (${Variables.getConfigId()}) ${Variables.getNameConfiguration()}`) 
      .setColor(color.general.aquamarine)
      .setDescription(message)
      .setFields({name: 'Guild ID', value: others[0], inline: true}, {name: 'Type', value: others[1], inline: true});
      await webhookClient.send({username: "Alka Webhook", embeds: [embed] });
      
    } catch (error) {
      console.error('[ERRORE] Errore durante l\'invio del webhook:', error);
      throw error;
    }
  }
}

module.exports = WebhookService;