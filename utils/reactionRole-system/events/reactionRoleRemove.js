// Code: utils/reactionRole-system/events/reactionRoleRemove.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file reactionRoleRemove.js
 * @module reactionRoleRemove
 * @description Questo file gestisce l'evento per la rimozione di un ruolo reazione!
 */

const { Events, EmbedBuilder} = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb, readDbAllWith1Params, readDbAllWith2Params, readDbWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

module.exports = {
  name: Events.MessageReactionRemove,
  async execute(messageReaction, user) {
    if(!user.bot) {
      const message = messageReaction.message;
      const emoji = messageReaction.emoji;
      const guild = message.guild;
      const member = await guild.members.fetch(user.id);
  
  
      // CONTROLLO SE LA FUNZIONE E' ABILITATA
      if (!await checkFeaturesIsEnabled(guild, 5)) return;
  
      try {
        let emojiResolve = "";
        if(emoji.id) {
          emojiResolve = `<:${emoji.name}:${emoji.id}>`;
        } else {
          emojiResolve = emoji.name;
        }
  
        const roles = await readDb('SELECT * FROM reaction_roles WHERE message_id = ? AND emoji = ?', message.id, emojiResolve);

        if(roles) {
          try {
            const role = await member.guild.roles.fetch(roles.roles_id);
            await member.roles.remove(role);
          }
          catch (error) {
            //pass
          }
        }
      
  
      }
      catch (error) {
        errorSendControls(error, member.client, guild, "\\autoRole-system\\autoRoleState.js");
      }
    }
  },
};