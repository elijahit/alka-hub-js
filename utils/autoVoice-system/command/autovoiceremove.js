const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const fs = require('fs');
const { readDb, runDb, readDbAllWith2Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { findAutoVoiceById } = require('../../../bin/service/DatabaseService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autovoiceremove')
    .setDescription('Use this command to delete an Auto Voice System configuration')
    .addIntegerOption(option => option.setName('autovoice_id').setDescription('Insert ID the Auto Voice System configuration to delete').setRequired(true)),
  async execute(interaction) {
    const autoVoiceId = interaction.options.getInteger('autovoice_id');

    // RECUPERO LA LINGUA
    let data = await language.databaseCheck(interaction.guild.id);
    const langagues_path = fs.readFileSync(`./languages/autoVoice-system/${data}.json`);
    const language_result = JSON.parse(langagues_path);
    // CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
    await returnPermission(interaction, "autovoice", async result => {
      if (!await allCheckFeatureForCommands(interaction, interaction.guild.id, 3, language_result.noPermission.description_embed_no_features_by_system,
        language_result.noPermission.description_limit_premium, language_result.noPermission.description_premium_feature,
        language_result.noPermission.description_embed_no_features)) return;
      try {
        if (result) {
          let logsTable = await findAutoVoiceById(interaction.guild.id, autoVoiceId);
          checkTable = logsTable?.get({ plain: true });
          const embedLog = new EmbedBuilder();
          //CONTROLLO SE LA ROW E' PRESENTE NEL DB
          if (checkTable) {
            //REMOVE THE AUTO VOICE SYSTEM CONFIGURATION

          } else {
            //THE AUTO VOICE SYSTEM CONFIGURATION DOES NOT EXIST
          }
        }
        else {
          await noHavePermission(interaction, language_result);
        }
      }
      catch (error) {
        errorSendControls(error, interaction.client, interaction.guild, "\\autoVoice-system\\autovoice.js");
      }
    });
  },
};