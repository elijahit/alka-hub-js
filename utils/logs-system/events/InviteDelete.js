const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');
const { errorSendControls } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT inviteState_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = {
  name: Events.InviteDelete,
  async execute(invite) {
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.db.get(sqlEnabledFeature, [invite.guild.id], (_, result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.db.get(sqlChannelId_log, [invite.guild.id], (_, result) => {
        if (!result?.inviteState_channel) return;
        if (result.inviteState_channel?.length < 5) return;
        // CONTROLLO DELLA LINGUA
        if (invite.guild?.id) {
          language.databaseCheck(invite.guild.id)
            .then(data => {
              const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
              const language_result = JSON.parse(langagues_path);

              invite.guild.channels.fetch(result.inviteState_channel)
                .then(channel_logs => {
                  const fields = [];
                  const embedLog = new EmbedBuilder();
                  
                  fields.push(
                    { name: `${language_result.inviteDelete.channel_invite}`, value: `${invite.channel}`, inline: true },
                    { name: `${language_result.inviteDelete.invite_code}`, value: `${invite.code}`, inline: true },
                    { name: " ", value: " " },
                    {name: `${language_result.inviteDelete.embed_url}`, value: `${invite.url}`, inline: true}

                  );


                  setTimeout(() => {
                    embedLog
                      .setAuthor({ name: `${language_result.inviteDelete.embed_title}` })
                      .addFields(fields)
                      .setFooter({ text: `${language_result.inviteDelete.embed_footer}`, iconURL: `${language_result.inviteDelete.embed_icon_url}` })
                      .setDescription(language_result.inviteDelete.embed_description)
                      .setColor(0x630505);
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
              errorSendControls(error, invite.client, invite.guild, "\\logs_system\\inviteDelete.js");
            });
        }
      });
    });
  },
};