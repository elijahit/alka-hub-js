const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { readDbAllWith2Params, runDb, readDbWith3Params, readDbWith4Params, readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const { channel } = require('diagnostics_channel');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.guild) return;
    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id);
      const langagues_path = readFileSync(`./languages/statsServer-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (interaction.customId == 'statsModal') {
        const customEmoji = await getEmojifromUrl(interaction.client, "stats");
        let nameChannel = interaction.fields.getTextInputValue('statsChannelName');
        let categoryId = interaction.fields.getTextInputValue('statsCategoryId');
        let type = interaction.fields.getTextInputValue('statsTypeChannel');

        const checkCategory = await readDbAllWith2Params('SELECT * FROM stats_system_category WHERE guildId = ? AND categoryId = ?', interaction.guild.id, categoryId)

        let channelCheck = (checkCategory[0] && parseInt(type) > 0 && parseInt(type) < 9 && nameChannel.includes("{0}")); // Controllo tutti i canali tranne status bar

        let channelStatusCheck = (checkCategory[0] && parseInt(type) == 9 && (nameChannel.includes("{0}") || nameChannel.includes("{1}") || nameChannel.includes("{2}"))); // Controllo status bar tranne gli altri canali
       if (channelCheck || channelStatusCheck) {
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
            name: "Loading...",
          });
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.channelStatsCommand.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.channelStatsCommand.description_embed.replace("{0}", `${channel}`))
            .setFooter({ text: `${language_result.channelStatsCommand.embed_footer}`, iconURL: `${language_result.channelStatsCommand.embed_icon_url}` })
            .setColor(0x32a852);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
          await runDb('INSERT INTO stats_system_channel (guildId, categoryId, channelId, typeChannel, markdown) VALUES (?, ?, ?, ?, ?)', interaction.guild.id, categoryId, channel.id, parseInt(type), nameChannel);
        } else {
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.categoryNotFound.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.categoryNotFound.description_embed)
            .setFooter({ text: `${language_result.categoryNotFound.embed_footer}`, iconURL: `${language_result.categoryNotFound.embed_icon_url}` })
            .setColor(0xad322a);
          await interaction.reply({ embeds: [embedLog], ephemeral: true });
        }
      }

    }
    catch (error) {
      console.log(error)
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\statsServer-system\\ticketInteraction.js");
    }
  },
};