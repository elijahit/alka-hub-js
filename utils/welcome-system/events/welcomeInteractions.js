// Code: utils/welcome-system/events/welcomeInteractions.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file welcomeInteractions.js
 * @module welcomeInteractions
 * @description Questo file gestisce le interazioni per il sistema di benvenuto!
 */

const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, Colors } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { readDbAllWith2Params, runDb, readDbWith3Params, readDbWith4Params, readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const emoji = require('../../../bin/data/emoji');
const color = require('../../../bin/data/colors');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.guild) return;
    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id);
      const langagues_path = readFileSync(`./languages/welcome-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (interaction.customId == 'welcomeMessageSetting') {
        const text = interaction.fields.getTextInputValue('descriptionWelcome');

        await runDb('UPDATE welcome SET text = ? WHERE guilds_id = ?', text, interaction.guild.id);

        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.welcomeModal.embed_title}`, iconURL: emoji.welcomeSystem.main })
          .setFooter({ text: `${language_result.welcomeModal.embed_footer}`, iconURL: `${language_result.welcomeModal.embed_icon_url}` })
          .setDescription(language_result.welcomeModal.description)
          .setColor(color.general.danger);
        await interaction.reply({embeds: [embedLog], ephemeral: true});
      }

    }
    catch (error) {
      console.log(error)
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\welcome-system\\welcomeInteractions.js");
    }
  },
};