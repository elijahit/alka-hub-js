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
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    database.db.get(sqlEnabledFeature, [oldMember.guild.id], (_, result_Db) => {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      database.db.get(sqlChannelId_log, [oldMember.guild.id], (_, result) => {
        if (!result.guildMemberState_channel) return;
        if (result.guildMemberState_channel?.length < 5) return;
        // CONTROLLO DELLA LINGUA
        if (oldMember.guild?.id) {
          language.databaseCheck(oldMember.guild.id)
            .then(data => {
              const langagues_path = readFileSync(`./languages/logs_system/${data}.json`);
              const language_result = JSON.parse(langagues_path);

              oldMember.guild.channels.fetch(result.guildMemberState_channel)
                .then(channel_logs => {
                  const fields = [];

                  fields.push(
                    { name: `${language_result.guildMemberUpdate.embed_user}`, value: `${oldMember}`, inline: true },
                    { name: `${language_result.guildMemberUpdate.embed_id}`, value: `${oldMember.id}`, inline: true },
                    { name: " ", value: " " },
                    { name: `${language_result.guildMemberUpdate.embed_username}`, value: `${oldMember.user.username}`, inline: true }
                  );

                  if (oldMember.user.bot) {
                    fields.push({ name: `${language_result.guildMemberUpdate.bot_embed}`, value: `${language_result.guildMemberUpdate.bot_embed_response}`, inline: true });
                  }

                  fields.push({ name: " ", value: " " });

                  if (oldMember.nickname != newMember.nickname) {
                    let nicknameOld, nicknameNew;

                    if (!oldMember.nickname) {
                      nicknameOld = language_result.guildMemberUpdate.empty_name;
                    } else {
                      nicknameOld = oldMember.nickname;
                    }

                    if (!newMember.nickname) {
                      nicknameNew = language_result.guildMemberUpdate.empty_name;
                    } else {
                      nicknameNew = newMember.nickname;
                    }

                    fields.push(
                      { name: `${language_result.guildMemberUpdate.old_name}`, value: `${nicknameOld}`, inline: true },
                      { name: `${language_result.guildMemberUpdate.new_name}`, value: `${nicknameNew}`, inline: true }
                    )
                  }

                  fields.push({ name: " ", value: " " });


                  if (oldMember._roles) {
                    let rolesContainer = "";
                    oldMember._roles.forEach(value => {
                      oldMember.guild.roles.fetch(value)
                        .then(roles => {
                          rolesContainer += `${roles} \n`
                        });
                    });
                    setTimeout(() => {
                      fields.push({ name: `${language_result.guildMemberUpdate.old_role}`, value: `${rolesContainer}`, inline: true });
                    });
                  }

                  if (newMember._roles) {
                    let rolesContainer = "";
                    newMember._roles.forEach(value => {
                      newMember.guild.roles.fetch(value)
                        .then(roles => {
                          rolesContainer += `${roles} \n`
                        });
                    });
                    setTimeout(() => {
                      fields.push({ name: `${language_result.guildMemberUpdate.new_role}`, value: `${rolesContainer}`, inline: true });
                    });
                  }

                  setTimeout(() => {
                    const embedLog = new EmbedBuilder()
                      .setAuthor({ name: `${language_result.guildMemberUpdate.embed_title}` })
                      .addFields(fields)
                      .setFooter({ text: `${language_result.guildMemberUpdate.embed_footer}`, iconURL: `${language_result.guildMemberUpdate.embed_icon_url}` })
                      .setDescription(language_result.guildMemberUpdate.embed_description)
                      .setColor(0x4287f5);
                    if (oldMember.user.avatar) {
                      embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${oldMember.id}/${oldMember.user.avatar}.png`);
                    }
                    channel_logs.send({ embeds: [embedLog] });
                  }, 2000);
                })
                .catch((error) => {
                  errorSendControls(error, oldMember.client, oldMember.guild, "\\logs_system\\GuildMemberUpdate.js");
                });
            })
            .catch((error) => {
              errorSendControls(error, oldMember.client, oldMember.guild, "\\logs_system\\GuildMemberUpdate.js");
            });
        }
      });
    });
  },
};