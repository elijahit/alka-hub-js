// Code: utils/statsServer-system/events/statsinteraction.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file statsinteraction.js
 * @module statsinteraction
 * @description Questo file gestisce l'evento per l'interazione con i bottoni di Stats Server!
 */

const { Events, ChannelType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { errorSendControls } = require('../../../bin/HandlingFunctions');
const moment = require('moment-timezone');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const { client } = require('../../../bin/client');
const { checkFeatureSystemDisabled } = require('../../../bin/functions/checkFeatureSystemDisabled');
const checkFeaturesIsEnabled = require('../../../bin/functions/checkFeaturesIsEnabled');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');
const { findByGuildIdAndcategoryIdStatisticsCategory, createStatistics, findByGuildIdAndChannelIdStatistics, updateStatistics, findLevelsConfigByGuildId, findAllStatistics, findGuildById } = require('../../../bin/service/DatabaseService');
const Variables = require('../../../bin/classes/GlobalVariables');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, variables) {
    if (!interaction.guild) return;
    if (!await checkFeatureSystemDisabled(6)) return;
    if (!await checkFeaturesIsEnabled(interaction.guild.id, 6, variables)) return;
    if (!await checkPremiumFeature(interaction.guild.id, 6,variables)) return;
    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id, variables);
      const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (interaction.customId == 'statsModal') {
        const customEmoji = emoji.statsServerSystem.main;
        let nameChannel = interaction.fields.getTextInputValue('statsChannelName');
        let categoryId = interaction.fields.getTextInputValue('statsCategoryId');
        let type = interaction.fields.getTextInputValue('statsTypeChannel');

        let checkCategory = await findByGuildIdAndcategoryIdStatisticsCategory(interaction.guild.id, categoryId, variables);
        checkCategory = checkCategory?.get({ plain: true });

        // CONTROLLI PER IL MARKDOWN DEI CANALI

        let channelCheck = (checkCategory && parseInt(type) > 3 && parseInt(type) < 9 && nameChannel.includes("{0}")); // Controllo tutti i canali tranne status bar, ora, data e (ora data)

        let channelDateCheck = (checkCategory && parseInt(type) == 1 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}"))); // Controllo i canali di data

        let channelHourCheck = (checkCategory && parseInt(type) == 2 && (nameChannel.includes("{0}") || nameChannel.includes("{1}"))); // Controllo i canali di ora

        let channelDateHourCheck = (checkCategory && parseInt(type) == 3 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}") || nameChannel.includes("{3}") || nameChannel.includes("{4}"))); // Controllo i canali di data e ora

        let channelStatusCheck = (checkCategory && parseInt(type) == 9 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}"))); // Controllo status bar tranne gli altri canali

        //  -----------------------------------------

        if (channelCheck || channelStatusCheck || channelDateCheck || channelHourCheck || channelDateHourCheck) {
          const category = await interaction.guild.channels.fetch(categoryId);
          // CREO IL CANALE NELLA CATEGORIA
          const channel = await interaction.guild.channels.create({
            parent: category,
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone,
                allow: [PermissionsBitField.Flags.ViewChannel],
                deny: [PermissionsBitField.Flags.Connect],
                type: 0,
              }
            ],
            name: "Loading (few minutes)...",
          });
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelStatsCommand.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.channelStatsCommand.description_embed.replace("{0}", `${channel}`))
            .setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
            .setColor(colors.general.success);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
          await createStatistics(interaction.guild.id, channel.id, nameChannel, parseInt(type), variables);
        } else {
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.categoryNotFound.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.categoryNotFound.description_embed)
            .setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
            .setColor(colors.general.error);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
        }
      }

      if (interaction.customId == 'statsModalEdit') {
        const customEmoji = emoji.statsServerSystem.main;
        let nameChannel = interaction.fields.getTextInputValue('statsChannelName');
        let channelId = interaction.fields.getTextInputValue('statsChannelId');

        let checkChannel = await findByGuildIdAndChannelIdStatistics(interaction.guild.id, channelId, variables);
        checkChannel = checkChannel?.get({ plain: true });
        // CONTROLLI PER IL MARKDOWN DEI CANALI

        let channelCheck = (checkChannel && checkChannel.type > 3 && checkChannel.type < 9 && nameChannel.includes("{0}")); // Controllo tutti i canali tranne status bar, ora, data e (ora data)

        let channelDateCheck = (checkChannel && checkChannel.type == 1 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}"))); // Controllo i canali di data

        let channelHourCheck = (checkChannel && checkChannel.type == 2 && (nameChannel.includes("{0}") || nameChannel.includes("{1}"))); // Controllo i canali di ora

        let channelDateHourCheck = (checkChannel && checkChannel.type == 3 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}") || nameChannel.includes("{3}") || nameChannel.includes("{4}"))); // Controllo i canali di data e ora

        let channelStatusCheck = (checkChannel && checkChannel.type == 9 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}"))); // Controllo status bar tranne gli altri canali

        //  -----------------------------------------

        if (channelCheck || channelStatusCheck || channelDateCheck || channelHourCheck || channelDateHourCheck) {
          const channel = await interaction.guild.channels.fetch(channelId);
          // EDUTI IL CANALE NELLA CATEGORIA
          await channel.edit({
            name: "Update (few minutes)...",
          });

          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelUpdateCommand.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.channelUpdateCommand.description_embed.replace("{0}", `${channel}`))
            .setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
            .setColor(colors.general.success);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
          await updateStatistics({ channel_name: nameChannel }, { where: { guild_id: interaction.guild.id, channel_id: channelId, config_id: variables.getConfigId() } });
        } else {
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelNotFound.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.channelNotFound.description_embed)
            .setFooter({ text: variables.getBotFooter(), iconURL: variables.getBotFooterIcon() })
            .setColor(colors.general.error);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
        }
      }

    }
    catch (error) {
      console.log(error)
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\statsServer-system\\statsInteraction.js", variables);
    }
  },
};
