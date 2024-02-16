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
  name: Events.InviteCreate,
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

                  const date = new Date(invite.expiresTimestamp);
                  let dateFinal, dateFinalH, maxUse;

                  if(Date.parse(date) == 0) {
                    dateFinal = language_result.inviteCreate.no_expiry;
                    dateFinalH = " ";
                  } else {
                    dateFinal = language_result.inviteCreate.date_format
                    .replace("{1}", `${date.getDate()}`)
                    .replace("{2}", `${date.getMonth()+1}`)
                    .replace("{3}", `${date.getFullYear()}`);
                    dateFinalH =  `| ${date.getHours()}:${date.getMinutes()}`;
                  }

                  if(invite.maxUses == 0) {
                    maxUse = language_result.inviteCreate.use_no_expiry;
                  } else {
                    maxUse = invite.maxUses;
                  }
                  
                  fields.push(
                    { name: `${language_result.inviteCreate.channel_invite}`, value: `${invite.channel}`, inline: true },
                    { name: `${language_result.inviteCreate.invite_code}`, value: `${invite.code}`, inline: true },
                    { name: " ", value: " " },
                    { name: `${language_result.inviteCreate.embed_expiry}`, value: `${dateFinal} ${dateFinalH}`, inline: true },
                    {name: `${language_result.inviteCreate.embed_inviter}`, value: `${invite.inviter}`, inline: true},
                    { name: " ", value: " " },
                    {name: `${language_result.inviteCreate.embed_use}`, value: `${maxUse}`, inline: true},
                    {name: `${language_result.inviteCreate.embed_url}`, value: `${invite.url}`, inline: true}

                  );


                  setTimeout(() => {
                    embedLog
                      .setAuthor({ name: `${language_result.inviteCreate.embed_title}` })
                      .addFields(fields)
                      .setFooter({ text: `${language_result.inviteCreate.embed_footer}`, iconURL: `${language_result.inviteCreate.embed_icon_url}` })
                      .setDescription(language_result.inviteCreate.embed_description)
                      .setColor(0x32a852);
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
              errorSendControls(error, invite.client, invite.guild, "\\logs_system\\InviteCreate.js");
            });
        }
      });
    });
  },
};