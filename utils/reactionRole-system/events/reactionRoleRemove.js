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
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const { findByGuildIdAndMessageIdAndEmojiReactions } = require('../../../bin/service/DatabaseService');

module.exports = {
  name: Events.MessageReactionRemove,
  async execute(messageReaction, user, variables) {
    if(!user.bot) {
      const message = messageReaction.message;
      const emoji = messageReaction.emoji;
      const guild = message.guild;
      const member = await guild.members.fetch(user.id);
  
  
      // CONTROLLO SE LA FUNZIONE E' ABILITATA
      if (!await checkFeatureSystemDisabled(5)) return;
      if (!await checkFeaturesIsEnabled(messageReaction.message.guild.id, 5, variables)) return;
      if (!await checkPremiumFeature(messageReaction.message.guild.id, 5, variables)) return;
  
      try {
        let emojiResolve = "";
        if(emoji.id) {
          emojiResolve = `<:${emoji.name}:${emoji.id}>`;
        } else {
          emojiResolve = emoji.name;
        }
  
        let roles = await findByGuildIdAndMessageIdAndEmojiReactions(messageReaction.message.guild.id, message.id, emojiResolve, variables);
        roles = roles?.get({ plain: true });
        if(roles) {
          try {
            const role = await member.guild.roles.fetch(roles.roles_id);
            await member.roles.remove(role);
          } catch {
            errorSendControls(error, member.client, guild, "\\autoRole-system\\autoRoleState.js", variables);
          }
        }
      
  
      }
      catch (error) {
        errorSendControls(error, member.client, guild, "\\autoRole-system\\autoRoleState.js", variables);
      }
    }
  },
};