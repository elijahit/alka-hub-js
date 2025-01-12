// Code: utils/translate-system/command/translate.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file translate.js
 * @module translate
 * @description Questo file contiene il comando per tradurre un testo da una lingua all'altra
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');
const emoji = require("../../../bin/data/emoji")
const colors = require("../../../bin/data/colors");
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Command to translate a text from one language to another')
    .setDescriptionLocalization("it", "Comando per tradurre un testo da una lingua a un altra")
    .addStringOption(value =>
      value
        .setName('from')
        .setDescription('Enter the starting language of the text (eg, it, en, es, fr)')
        .setDescriptionLocalization("it", "Inserisci la lingua di partenza del testo (es, it, en, es, fr)")
        .setRequired(true))
    .addStringOption(value =>
      value
        .setName('to')
        .setDescription('Enter the language to which you want to translate the text (eg, it, en, es, fr)')
        .setDescriptionLocalization("it", "Inserisci la lingua in cui vuoi tradurre il testo (es, it, en, es, fr)")
        .setRequired(true))
    .addStringOption(value =>
      value
        .setName('text')
        .setDescription('Enter the text to be translated')
        .setDescriptionLocalization("it", "Inserisci il testo da tradurre")
        .setRequired(true)),
  async execute(interaction, variables) {
    let fromLang = await interaction.options.get("from")?.value;
    let toLang = await interaction.options.get("to")?.value;
    let textTranslate = await interaction.options.get("text")?.value;
    // RECUPERO LA LINGUA
    try {
      let data = await language.databaseCheck(interaction.guild.id, variables);
      const langagues_path = readFileSync(`./languages/translate-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 12, true, language_result.noPermission.description_embed_no_features_by_system,
        language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
        language_result.noPermission.description_embed_no_features, variables)) return;
      if (!fromLang || !toLang || !textTranslate) return;

      const customEmoji = emoji.translateSystem.main;
      const embedLog = new EmbedBuilder();
      if (fromLang === toLang) {
        embedLog
          .setDescription(`## ${language_result.translateCommand.embed_title}\n` + `${language_result.translateCommand.description_embed_same_lang}`)
          .addFields(fields)
          .setThumbnail(variables.getBotFooterIcon())
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setColor(colors.general.blue);
        await interaction.reply({ embeds: [embedLog], flags: 64 });
      } else {
        try {
          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${textTranslate}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
          const json = await res.json();
          let translatedText = "";
          json[0].forEach((element) => {
            translatedText += element[0] + " "; 
          });
  
          embedLog
            .setDescription(`## ${language_result.translateCommand.embed_title}\n` + `${language_result.translateCommand.description_embed.replace("{0}", toLang).replace("{1}", translatedText)}`)
            .setThumbnail(variables.getBotFooterIcon())
            .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
            .setColor(colors.general.blue);
          await interaction.reply({ embeds: [embedLog] });
        } catch (error) {
          errorSendControls(error, interaction.client, interaction.guild, "\\translate-system\\translate.js", variables);
          embedLog
            .setDescription(`## ${language_result.translateCommand.embed_title}\n` + `${language_result.translateCommand.description_embed_error}`)
            .setThumbnail(variables.getBotFooterIcon())
            .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
            .setColor(colors.general.error);
          await interaction.reply({ embeds: [embedLog], flags: 64 });
        }
      }

    }
    catch (error) {
      errorSendControls(error, interaction.client, interaction.guild, "\\translate-system\\translate.js", variables);
    }
  },
};