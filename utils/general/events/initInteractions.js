// Code: utils/general/events/initInteractions.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file initInteractions.js
 * @module initInteractions
 * @description Questo file contiene l'evento per inizializzare il bot sul server
 */

const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, Colors } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { readDbAllWith2Params, runDb, readDbWith3Params, readDbWith4Params, readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const emoji = require('../../../bin/data/emoji');
const color = require('../../../bin/data/colors');
const { findGuildById, updateGuild, createGuild } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, variables) {
    if (!interaction.guild) return;
    if (!interaction.isModalSubmit()) return;
    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id, variables);
      const langagues_path = readFileSync(`./languages/general/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (interaction.customId == 'configModal') {
        const languageValue = interaction.fields.getTextInputValue('languageInput');
        let timeZoneValue = interaction.fields.getTextInputValue('timeZoneInput');

        if (timeZoneValue !== "") {
          const timeZoneArray = require("../data/timeZone");
          const timeZoneFiltered = timeZoneArray.map(entry => entry.split('|'));
          timeZoneValue = timeZoneFiltered.filter(value => value[0] == timeZoneValue || value[1] == timeZoneValue);
        }
        if (timeZoneValue.length == 0) return;
        if (!['IT', 'EN'].includes(languageValue)) return;


        let guild = await findGuildById(interaction.guild.id, variables);
        guild = guild?.get({ plain: true }) ?? false;
        if (guild) await updateGuild({ language: languageValue, time_zone: timeZoneValue[0][1] }, { where: { guild_id: interaction.guild.id, config_id: variables.getConfigId() } });
        if (!guild) await createGuild(interaction.guild.id, languageValue, timeZoneValue[0][1], variables);

        const embedLog = new EmbedBuilder()
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setDescription(`## ${language_result.initCommand.embed_title}\n` + language_result.initCommand.description_embed.replaceAll("{0}", variables.getBotName()))
          .setColor(color.general.success)
          .setThumbnail(variables.getBotFooterIcon());
        await interaction.reply({ embeds: [embedLog], flags: 64 });
      }

    }
    catch (error) {
      console.log(error)
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\welcome-system\\welcomeInteractions.js", variables);
    }
  },
};