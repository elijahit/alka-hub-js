const { Events, EmbedBuilder, TextChannel, AttachmentBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb, readDbAllWith1Params, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const { makeWelcomeImage } = require('../welcomeHandling');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkUsersDb = require('../../../bin/functions/checkUsersDb');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');


module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    checkUsersDb(member, member.guild);
    if (!await checkFeaturesIsEnabled(member.guild, 10)) return;
    try {
      let check = await readDb('SELECT * FROM welcome WHERE guilds_id = ?', member.guild.id);
      if (check) {
        let channel;
        try {
          channel = await member.guild.channels.fetch(check.channel_id);
        } catch {
          await runDb('DELETE FROM welcome WHERE guilds_id = ?', member.guild.id);
        }
        try {

          // GENERO IL MESSAGGIO
          // RECUPERO LA LINGUA
          let data = await language.databaseCheck(member.guild.id);
          const langagues_path = readFileSync(`./languages/welcome-system/${data}.json`);
          const language_result = JSON.parse(langagues_path);

          
          let imageResolve = await makeWelcomeImage(member.user, member.guild.name, language_result, check.color, check.backgroundUrl);

          const file = new AttachmentBuilder(imageResolve, {
            name: "welcome.jpg"
          })
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.welcomeMessage.embed_title}`, iconURL: emoji.welcomeSystem.main })
            .setFooter({ text: `${language_result.welcomeMessage.embed_footer}`, iconURL: `${language_result.welcomeMessage.embed_icon_url}` })
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
      errorSendControls(error, member.client, member.guild, "\\welcome-system\\welcomeEvents.js");
    }

  },
};