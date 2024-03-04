const { Events, EmbedBuilder} = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb, readDbAllWith1Params, readDbAllWith2Params, readDbWith3Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlEnabledFeature = `SELECT reactionRoleSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ----------------

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(messageReaction, user) {
    if(!user.bot) {
      const message = messageReaction.message;
      const emoji = messageReaction.emoji;
      const guild = message.guild;
      const member = await guild.members.fetch(user.id);
  
  
      // CONTROLLO SE LA FUNZIONE E' ABILITATA
      const result_Db = await readDb(sqlEnabledFeature, guild.id);
      if (!result_Db) return;
      if (result_Db.reactionRoleSystem_enabled != 1) return;
  
      try {
        let emojiResolve = "";
        if(emoji.id) {
          emojiResolve = `<:${emoji.name}:${emoji.id}>`;
        } else {
          emojiResolve = emoji.name;
        }
  
        const roles = await readDbWith3Params('SELECT * FROM reactionrole_system_reactions WHERE guildId = ? AND messageId = ? AND emoji = ?', guild.id, message.id, emojiResolve);
        if(roles) {
          try {
            const role = await member.guild.roles.fetch(roles.roleId);
            await member.roles.add(role);
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