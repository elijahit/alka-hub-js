// Code: utils/reactionRole-system/events/reactionRoleAdd.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file reactionRoleAdd.js
 * @module reactionRoleAdd
 * @description Questo file gestisce l'evento per l'aggiunta di un ruolo reazione!
 */

const { Events } = require('discord.js');
const language = require('../../../languages/languages');
const { errorSendControls } = require('../../../bin/HandlingFunctions');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const { findByGuildIdAndMessageIdAndEmojiReactions } = require('../../../bin/service/DatabaseService');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(messageReaction, user, burst, variables) {
    if (!user.bot) {
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
        if (emoji.id) {
          emojiResolve = `<:${emoji.name}:${emoji.id}>`;
        } else {
          emojiResolve = emoji.name;
        }

        let roles = await findByGuildIdAndMessageIdAndEmojiReactions(messageReaction.message.guild.id, message.id, emojiResolve, variables);
        roles = roles?.get({ plain: true });
        if (roles) {
          try {
            const role = await member.guild.roles.fetch(roles.roles_id);
            await member.roles.add(role);
          } catch (error) {
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