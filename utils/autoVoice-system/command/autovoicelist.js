// Code: utils/autoVoice-system/command/autovoicelist.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file autovoicelist.js
 * @module autovoicelist
 * @description Questo file contiene il comando per visualizzare la lista delle configurazioni del sistema di auto voice
 */

const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const fs = require('fs');
const { readDb, runDb, readDbAllWith2Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { findAllAutoVoiceByGuild } = require('../../../bin/service/DatabaseService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autovoicelist')
    .setDescription('Use this commando to view the list of Auto Voice System configurations'),
  async execute(interaction) {

    // RECUPERO LA LINGUA
    let data = await language.databaseCheck(interaction.guild.id);
    const langagues_path = fs.readFileSync(`./languages/autoVoice-system/${data}.json`);
    const language_result = JSON.parse(langagues_path);
    // CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
    await returnPermission(interaction, "autovoice", async result => {
      try {
        if (result) {
          let autoVoiceTable = await findAllAutoVoiceByGuild(interaction.guild.id);
          checkTable = autoVoiceTable;
          const embedLog = new EmbedBuilder();
          //CONTROLLO SE LA ROW E' PRESENTE NEL DB
          if (checkTable.length > 0) {
            // SE E' PRESENTE NEL DB LA ELIMINA E MOSTRA UN MESSAGGIO DI SUCCESSO
            customEmoji = emoji.general.trueMaker
            embedLog.setColor(colors.general.olive);
            embedLog.setDescription(language_result.list.description_embed);
            embedLog.addFields({ name: "Auto Voice List", value: checkTable.map((value, index) => { return `**ID:** ${value.id} - **Channel:** <#${value.channel_id}>`}).join("\n") });

          } else {
            // SE NON E' PRESENTE NEL DB MOSTRA UN ERRORE
            customEmoji = emoji.general.errorMarker
            embedLog.setColor(colors.general.error);
            embedLog.setDescription(language_result.list.description_embed_empty);
          }
          embedLog.setTitle(language_result.list.embed_title);
          embedLog.setAuthor({ name: `${language_result.list.embed_title}`, iconURL: customEmoji })
          embedLog.setFooter({ text: `${Variables.getBotFooter()}`, iconURL: `${Variables.getBotFooterIcon()}` });
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
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