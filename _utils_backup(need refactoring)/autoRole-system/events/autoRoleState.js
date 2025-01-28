const { Events, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb, readDbAllWith1Params } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlEnabledFeature = `SELECT autoRoleSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ----------------


module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {



    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const result_Db = await readDb(sqlEnabledFeature, member.guild.id);
    if (!result_Db) return;
    if (result_Db.autoRoleSystem_enabled != 1) return;
    try {
      const roles = await readDbAllWith1Params('SELECT * FROM autorole_system_roles WHERE guildId = ?', member.guild.id);

      if(roles?.length > 0) {
        for (const value of roles) {
          try {
            const role = await member.guild.roles.fetch(value.roleId);
            await member.roles.add(role);
          }
          catch {
            //pass
          }
      }
      }
    

    }
    catch (error) {
      errorSendControls(error, oldState.client, oldState.guild, "\\autoRole-system\\autoRoleState.js");
    }
  },
};