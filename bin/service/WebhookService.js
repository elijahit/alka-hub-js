// Code: WebhookService - bin/service/WebhookService.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file WebhookService.js
 * @module WebhookService
 * @description Contiene i metodi per inviare i webhook
*/

const {WebhookClient, EmbedBuilder} = require('discord.js');
const color = require('../data/colors');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../../config.json');
const configJson = fs.readFileSync(configPath, 'utf8');
const configFile = JSON.parse(configJson);

class WebhookService {
  constructor() {
    // Initialize any required properties here
  }

  async sendWebhooksEmbedErrorLog(message, others, variables) {
    try {
      const webhookClient = new WebhookClient({ url: configFile.webhook.error });
      const embed = new EmbedBuilder()
      .setTitle(`Alka Webhook | Errore - (${variables.getConfigId()}) ${variables.getNameConfiguration()}`) 
      .setColor(color.general.error)
      .setDescription(message)
      .setFields({name: 'Guild ID', value: others[0], inline: true}, {name: 'Type', value: others[1], inline: true});
      await webhookClient.send({username: "Alka Webhook", embeds: [embed] });

    } catch (error) {
      console.error('[ERRORE] Errore durante l\'invio del webhook:', error);
    }
  }

  async sendWebhooksEmbedLogs(message, others, variables) {
    try {
      const webhookClient = new WebhookClient({ url: configFile.webhook.general });
      const embed = new EmbedBuilder()
      .setTitle(`Alka Webhook | Logs - (${variables.getConfigId()}) ${variables.getNameConfiguration()}`) 
      .setColor(color.general.aquamarine)
      .setDescription(message)
      .setFields({name: 'Guild ID', value: others[0], inline: true}, {name: 'Type', value: others[1], inline: true});
      await webhookClient.send({username: "Alka Webhook", embeds: [embed] });
      
    } catch (error) {
      console.error('[ERRORE] Errore durante l\'invio del webhook:', error);
    }
  }
}

module.exports = WebhookService;