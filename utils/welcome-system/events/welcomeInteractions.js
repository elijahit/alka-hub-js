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
const { errorSendControls } = require('../../../bin/HandlingFunctions');
const emoji = require('../../../bin/data/emoji');
const color = require('../../../bin/data/colors');
const { updateWelcome } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, variables) {
    if (!interaction.guild) return;
    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id, variables);
      const langagues_path = readFileSync(`./languages/welcome-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (interaction.customId == 'welcomeMessageSetting') {
        const text = interaction.fields.getTextInputValue('descriptionWelcome');

				await updateWelcome({ text: text }, {where: { guild_id: interaction.guild.id }});


        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.welcomeModal.embed_title}`, iconURL: emoji.welcomeSystem.main })
          .setFooter({ text: Variables.getBotFooter(), iconURL: Variables.getBotFooterIcon() })
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