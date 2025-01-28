const { Events, EmbedBuilder, TextChannel, Colors } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmoji, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');

// QUERY DEFINITION
let sql = `SELECT * FROM logs_system WHERE guilds_id = ?`;
// ------------ //

module.exports = {
  name: Events.InviteDelete,
  async execute(invite) {
    let customEmoji = emoji.general.deleteMarker;

    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const resultDb = await readDb(sql, invite.guild.id);
    if (!resultDb) return;
    if (!await checkFeaturesIsEnabled(invite.guild, 1)) return;
    if (!resultDb["invite_state_channel"]) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (invite.guild?.id) {
        const data = await language.databaseCheck(invite.guild.id);

        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        const channel_logs = await invite.guild.channels.fetch(resultDb["invite_state_channel"]);

        const fields = [];
        const embedLog = new EmbedBuilder();

        fields.push(
          { name: `${language_result.inviteDelete.channel_invite}`, value: `${invite.channel}`, inline: true },
          { name: `${language_result.inviteDelete.invite_code}`, value: `${invite.code}`, inline: true },
          { name: " ", value: " " },
          { name: `${language_result.inviteDelete.embed_url}`, value: `${invite.url}`, inline: true }

        );

        embedLog
          .setAuthor({ name: `${language_result.inviteDelete.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${language_result.inviteDelete.embed_footer}`, iconURL: `${language_result.inviteDelete.embed_icon_url}` })
          .setDescription(language_result.inviteDelete.embed_description)
          .setColor(colors.general.error);
        channel_logs.send({ embeds: [embedLog] })
      }
    }
    catch (error) {
      errorSendControls(error, invite.client, invite.guild, "\\logs_system\\InviteDelete.js");
    }

  },
};