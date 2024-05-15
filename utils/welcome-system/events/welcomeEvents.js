const { Events, EmbedBuilder, TextChannel, AttachmentBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb, readDbAllWith1Params, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const { makeWelcomeImage } = require('../welcomeHandling');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT addMember_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT welcomeMessage_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    let customEmoji = await getEmojifromUrl(member.client, "welcome");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const result_Db = await readDb(sqlEnabledFeature, member.guild.id);
    if (!result_Db) return;
    if (result_Db.welcomeMessage_enabled != 1) return;
    try {
      let check = await readDbAllWith1Params('SELECT * FROM welcome_message_container WHERE guildId = ?', member.guild.id);
      if (check.length > 0) {
        let channel;
        try {
          channel = await member.guild.channels.fetch(check[0].channelId);
        } catch {
          await runDb('DELETE FROM welcomeMessage_enabled WHERE guildId = ?', member.guild.id);
        }
        try {

          // GENERO IL MESSAGGIO
          // RECUPERO LA LINGUA
          let data = await language.databaseCheck(member.guild.id);
          const langagues_path = readFileSync(`./languages/welcome-system/${data}.json`);
          const language_result = JSON.parse(langagues_path);

          
          let imageResolve = await makeWelcomeImage(member.user, member.guild.name, language_result, check[0].color, check[0].backgroundUrl);

          const file = new AttachmentBuilder(imageResolve, {
            name: "welcome.jpg"
          })
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.welcomeMessage.embed_title}`, iconURL: customEmoji })
            .setFooter({ text: `${language_result.welcomeMessage.embed_footer}`, iconURL: `${language_result.welcomeMessage.embed_icon_url}` })
            .setImage("attachment://welcome.jpg")
            .setColor(0xebae34);

          if(check[0].text && check[0].text?.length > 0) {
            embedLog.setDescription(check[0].text);
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