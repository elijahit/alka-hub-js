const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync, read } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emojis = require('../../../bin/data/emoji');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { findLogsByGuildId } = require('../../../bin/service/DatabaseService');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const Variables = require('../../../bin/classes/GlobalVariables');

module.exports = {
  name: Events.GuildEmojiDelete,
  async execute(emoji) {
    let customEmoji = emojis.general.deleteMarker;
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    if (!await checkFeatureSystemDisabled(1)) return;
    if (!await checkFeaturesIsEnabled(emoji.guild.id, 1)) return;
    if (!await checkPremiumFeature(emoji.guild.id, 1)) return;
    // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
    try {
      // CONTROLLO DELLA LINGUA
      if (emoji.guild?.id) {
        let data = await language.databaseCheck(emoji.guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let resultDb = await findLogsByGuildId(emoji.guild.id);
        resultDb = resultDb?.get({ plain: true });
        if (!resultDb || !resultDb["emoji_state_channel"]) return;

        let channel_logs = await emoji.guild.channels.fetch(resultDb["emoji_state_channel"]);
        const fields = [];

        fields.push(
          { name: `${language_result.emojiDelete.emoji_name}`, value: `${emoji.name}`, inline: true },
          { name: `${language_result.emojiDelete.emoji_id}`, value: `${emoji.id}`, inline: true }
        );

        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.emojiDelete.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` })
          .setDescription(language_result.emojiDelete.emoji_delete)
          .setColor(colors.general.error);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, emoji.client, emoji.guild, "\\logs_system\\EmojiDelete.js");
    }
  },
};