// Code: utils/welcome-system/events/welcomeEvents.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file welcomeEvents.js
 * @module welcomeEvents
 * @description Questo file gestisce l'evento per il benvenuto di un utente!
 */

const { Events, EmbedBuilder, TextChannel, AttachmentBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { errorSendControls } = require('../../../bin/HandlingFunctions');
const { makeWelcomeImage } = require('../welcomeHandling');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { findByGuildIdWelcome } = require('../../../bin/service/DatabaseService');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const Variables = require('../../../bin/classes/GlobalVariables');


module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, variables) {
    if (!await checkFeatureSystemDisabled(10)) return;
    if (!await checkFeaturesIsEnabled(member.guild.id, 10, variables)) return;
    if (!await checkPremiumFeature(member.guild.id, 10, variables)) return;
    try {
      let check = await findByGuildIdWelcome(member.guild.id, variables);
      check = check?.get({ plain: true });
      if (check) {
        let channel;
        try {
          channel = await member.guild.channels.fetch(check.channel_id);
        } catch {
          // SE NON TROVO IL CANALE
          return;
        }
        try {

          // GENERO IL MESSAGGIO
          // RECUPERO LA LINGUA
          let data = await language.databaseCheck(member.guild.id, variables);
          const langagues_path = readFileSync(`./languages/welcome-system/${data}.json`);
          const language_result = JSON.parse(langagues_path);

            let imageResolve = await makeWelcomeImage(member.user, member.guild.name, language_result, check.color, check.background_url);

          const file = new AttachmentBuilder(imageResolve, {
            name: "welcome.jpg"
          })
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.welcomeMessage.embed_title}`, iconURL: emoji.welcomeSystem.main })
            .setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
            .setImage("attachment://welcome.jpg")
            .setColor(colors.general.danger);

          if(check.text && check.text?.length > 0) {
            embedLog.setDescription(check.text);
          }

          await channel.send({ content: `${member}`, files: [file], embeds: [embedLog] })
        } catch (error) {
          console.log(error);
        }

      }
    }
    catch (error) {
      errorSendControls(error, member.client, member.guild, "\\welcome-system\\welcomeEvents.js", variables);
    }

  },
};