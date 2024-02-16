const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');
const { errorSendControls } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT guildMemberState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.db.get(sqlEnabledFeature, [member.guild.id], (_, result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.db.get(sqlChannelId_log, [member.guild.id], (_, result) => {
        if (!result?.guildMemberState_channel) return;
        if (result.guildMemberState_channel?.length < 5) return;
        // CONTROLLO DELLA LINGUA
        if (member.guild?.id) {
          language.databaseCheck(member.guild.id)
            .then(data => {
              const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
              const language_result = JSON.parse(langagues_path);

              member.guild.channels.fetch(result.guildMemberState_channel)
                .then(channel_logs => {
                  const fields = [];

                  fields.push(
                    {name: `${language_result.guildMemberAdd.embed_user}`, value: `${member}`, inline: true},
                    {name: `${language_result.guildMemberAdd.embed_id}`, value: `${member.id}`, inline: true},
                    {name: " ", value: " "},
                    {name: `${language_result.guildMemberAdd.embed_username}`, value: `${member.user.username}`, inline: true}
                  );

                  if (member.user.bot) {
                    fields.push({name: `${language_result.guildMemberAdd.bot_embed}`, value: `${language_result.guildMemberAdd.bot_embed_response}`, inline: true});
                  }

                  setTimeout(() => {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.guildMemberAdd.embed_title}` })
                      .addFields(fields)
                      .setFooter({ text: `${language_result.guildMemberAdd.embed_footer}`, iconURL: `${language_result.guildMemberAdd.embed_icon_url}` })
                      .setDescription(language_result.guildMemberAdd.embed_description)
                      .setColor(0x368c29);
                    if(member.user.avatar) {
                      embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`);
                    }
                    channel_logs.send({ embeds: [embedLog] })
                      .catch(() => {
                        return;
                      });
                  }, 2000);
                })
                .catch((error) => {
                  return;
                });
            })
            .catch((error) => {
              errorSendControls(error, member.client, member.guild, "\\logs_system\\GuildMemberAdd.js");
            });
        }
      });
    });
  },
};