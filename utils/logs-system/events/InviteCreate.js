const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');

// QUERY DEFINITION
let sql = `SELECT * FROM logs_system WHERE guilds_id = ?`;
let sqlFeatureCheck = `SELECT * FROM guilds WHERE guilds_id = ?`;
// ------------ //

module.exports = {
  name: Events.InviteCreate,
  async execute(invite) {
    let customEmoji = emoji.logsSystem.newInviteMarker;

    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, invite.guild.id);
    const checkerFeatureDb = await readDb(sqlFeatureCheck, invite.guild.id);
    if (!resultDb) return;
    if (checkerFeatureDb["is_enabled_logs"] != 1) return;
    if (!resultDb["invite_state_channel"]) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (invite.guild?.id) {
        let data = await language.databaseCheck(invite.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await invite.guild.channels.fetch(resultDb["invite_state_channel"]);
        const fields = [];
        const embedLog = new EmbedBuilder();

        const date = new Date(invite.expiresTimestamp);
        let dateFinal, dateFinalH, maxUse;

        if (Date.parse(date) == 0) {
          dateFinal = language_result.inviteCreate.no_expiry;
          dateFinalH = " ";
        } else {
          dateFinal = language_result.inviteCreate.date_format
            .replace("{1}", `${date.getDate()}`)
            .replace("{2}", `${date.getMonth() + 1}`)
            .replace("{3}", `${date.getFullYear()}`);
          dateFinalH = `| ${date.getHours()}:${date.getMinutes()}`;
        }

        if (invite.maxUses == 0) {
          maxUse = language_result.inviteCreate.use_no_expiry;
        } else {
          maxUse = invite.maxUses;
        }

        fields.push(
          { name: `${language_result.inviteCreate.channel_invite}`, value: `${invite.channel}`, inline: true },
          { name: `${language_result.inviteCreate.invite_code}`, value: `${invite.code}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.inviteCreate.embed_expiry}`, value: `${dateFinal} ${dateFinalH}`, inline: true },
          { name: `${language_result.inviteCreate.embed_inviter}`, value: `${invite.inviter}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.inviteCreate.embed_use}`, value: `${maxUse}`, inline: true },
          { name: `${language_result.inviteCreate.embed_url}`, value: `${invite.url}`, inline: true }

        );


        embedLog
          .setAuthor({ name: `${language_result.inviteCreate.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${language_result.inviteCreate.embed_footer}`, iconURL: `${language_result.inviteCreate.embed_icon_url}` })
          .setDescription(language_result.inviteCreate.embed_description)
          .setColor(colors.general.success);
        channel_logs.send({ embeds: [embedLog] })
      }
    }
    catch (error) {
      errorSendControls(error, invite.client, invite.guild, "\\logs_system\\InviteCreate.js");
    }
  },
};