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
const { findByGuildIdTranslate, deleteByGuildIdTranslate, createTranslate } = require('../../../bin/service/DatabaseService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translatesetting')
    .setDescription('Command to set the translation mode with reaction')
    .setDescriptionLocalization("it", "Comando per settare la modalità di traduzione con reaction")
    .addStringOption(value =>
      value
        .setName('mode')
        .setDescription('Insert the translation mode with reaction')
        .setDescriptionLocalization("it", "Inserisci la modalità di traduzione con reaction")
        .setRequired(true)
        .addChoices({
          name: "Public",
          value: "0",
        })
        .addChoices({
          name: "Private",
          value: "1",
        })),
  async execute(interaction, variables) {
    let mode = await interaction.options.get("mode")?.value;
    // RECUPERO LA LINGUA
    try {
      let data = await language.databaseCheck(interaction.guild.id, variables);
      const langagues_path = readFileSync(`./languages/translate-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 12, true, language_result.noPermission.description_embed_no_features_by_system,
        language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
        language_result.noPermission.description_embed_no_features, variables)) return;
      if (!mode) return;
      await returnPermission(interaction, "translate", async result => {
        const customEmoji = emoji.translateSystem.main;
        const embedLog = new EmbedBuilder();
        if (result) {
          let translateCheck = await findByGuildIdTranslate(interaction.guild.id, variables);
          translateCheck = translateCheck?.get({ plain: true });
          
          if (translateCheck) {
            await deleteByGuildIdTranslate(interaction.guild.id, variables);
            embedLog
              .setDescription(`## ${language_result.translateSettingCommand.embed_title}\n` + `${language_result.translateSettingCommand.description_embed_remove}`)
              .setThumbnail(variables.getBotFooterIcon())
              .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
              .setColor(colors.general.blue);
            await interaction.reply({ embeds: [embedLog], flags: 64 });
          } else {
            await createTranslate(interaction.guild.id, mode, variables);
            embedLog
              .setDescription(`## ${language_result.translateSettingCommand.embed_title}\n` + `${language_result.translateSettingCommand.description_embed}`)
              .setThumbnail(variables.getBotFooterIcon())
              .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
              .setColor(colors.general.blue);
            await interaction.reply({ embeds: [embedLog], flags: 64 });
          }
        }
      });
    }
    catch (error) {
      errorSendControls(error, interaction.client, interaction.guild, "\\translate-system\\translatesetting.js", variables);
    }
  },
};