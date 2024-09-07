const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync, read } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

// QUERY DEFINITION
let sql = `SELECT * FROM logs_system WHERE guilds_id = ?`;
// ------------ //

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    let customEmoji = emoji.logsSystem.updateMemberMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    try {
      const resultDb = await readDb(sql, oldMember.guild.id);
      if (!resultDb) return;
      if (!await checkFeaturesIsEnabled(oldMember.guild, "is_enabled_logs")) return;
      if(!resultDb["member_state_channel"]) return;
      // CONTROLLO DELLA LINGUA
      if (oldMember.guild?.id) {
        let data = await language.databaseCheck(oldMember.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channelLogs = await oldMember.guild.channels.fetch(resultDb["member_state_channel"]);
        const fields = [];
        let changeCheck = false;

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
          changeCheck = true;
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

        if (oldMember._roles.length != newMember._roles.length) {
          changeCheck = true;
          if (oldMember._roles) {
            let rolesContainer = " ";
            await oldMember._roles.forEach(async value => {
              let roles = await oldMember.guild.roles.fetch(value);
              rolesContainer += `${roles} \n`;
            });
            fields.push({ name: `${language_result.guildMemberUpdate.old_role}`, value: `${rolesContainer}`, inline: true });
          }

          if (newMember._roles) {
            let rolesContainer = " ";
            await newMember._roles.forEach(async value => {
              let roles = await newMember.guild.roles.fetch(value);
              rolesContainer += `${roles} \n`;
            });
            fields.push({ name: `${language_result.guildMemberUpdate.new_role}`, value: `${rolesContainer}`, inline: true });
          }
        }
        if (!changeCheck) return;
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.guildMemberUpdate.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${language_result.guildMemberUpdate.embed_footer}`, iconURL: `${language_result.guildMemberUpdate.embed_icon_url}` })
          .setDescription(language_result.guildMemberUpdate.embed_description)
          .setColor(colors.general.blue);
        if (oldMember.user.avatar) {
          embedLog.setThumbnail(`https://cdn.discordapp.com/avatars/${oldMember.id}/${oldMember.user.avatar}.png`);
        }
        try {
          channelLogs.send({ embeds: [embedLog] });;
        }
        catch {
          return;
        }
      }
    }
    catch (error) {
      errorSendControls(error, oldMember.client, oldMember.guild, "\\logs_system\\GuildMemberUpdate.js");
    }
  },
};