const { Events } = require('discord.js');
const { errorSendControls } = require('../../../bin/HandlingFunctions');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { findAllAutoRolesByGuildId } = require('../../../bin/service/DatabaseService');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');


module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, variables) {
    if (!await checkFeatureSystemDisabled(4)) return;
      if (!await checkFeaturesIsEnabled(member.guild.id, 4, variables)) return;
      if (!await checkPremiumFeature(member.guild.id, 4, variables)) return;
    try {
      const roles = await findAllAutoRolesByGuildId(member.guild.id, variables);

      if(roles?.length > 0) {
        for (let value of roles) {
          value = value?.get({ plain: true });
          try {
            const role = await member.guild.roles.fetch(value.role_id);
            await member.roles.add(role);
          }
          catch {
            errorSendControls(`Error: ${value.role_id} not found`, member.client, member.guild, "\\autoRole-system\\autoRoleState.js", variables);
          }
      }
      }
    

    }
    catch (error) {
      errorSendControls(error, oldState.client, oldState.guild, "\\autoRole-system\\autoRoleState.js");
    }
  },
};