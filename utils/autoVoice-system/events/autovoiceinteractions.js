const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const language = require('../../../languages/languages');
const { readDbAllWith2Params, runDb, readDbWith3Params, readDbWith4Params, readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, getEmoji, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id);
      const langagues_path = readFileSync(`./languages/autoVoice-system/${data}.json`);
      const language_result = JSON.parse(langagues_path);

      if (interaction.customId == 'autoVoiceSelectMenu') {
        let value = interaction.values;
        let typeVoice;
        await value.forEach(async v => {
          switch (v) {
            case "interactionVoice":
              typeVoice = 1;
              break;
            case "automaticVoice":
              typeVoice = 2;
              break;
            case "incrementerVoice":
              typeVoice = 3;
              break;

          }
          await runDb(`UPDATE autovoice_system_creator SET typeVoice = ? WHERE guildId = ? AND authorId = ?`, typeVoice, interaction.guild.id, interaction.user.id);
        });
        // RISPONDO ALL'INTERAZIONE ELIMINO IL MESSAGGIO E NE RICREO UNO NUOVO
        const privateEmoji = await getEmoji(interaction.client, "private");
        const freeEmoji = await getEmoji(interaction.client, "free_voice");
        const selectSetup_Creator = new StringSelectMenuBuilder()
          .setCustomId('autoVoiceSelectMenu_creatorType')
          .setPlaceholder(language_result.selectSetup_Creator.placeholder)
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel(language_result.selectSetup_Creator.label_private)
              .setValue("private")
              .setEmoji(privateEmoji.id),
            new StringSelectMenuOptionBuilder()
              .setLabel(language_result.selectSetup_Creator.label_free)
              .setValue("free")
              .setEmoji(freeEmoji.id),
          );

        const row = new ActionRowBuilder()
          .addComponents(selectSetup_Creator);

        const customEmoji = await getEmojifromUrl(interaction.client, "utilitysettings")
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.selectSetup_Creator.embed_title}`, iconURL: customEmoji })
          .setDescription(language_result.selectSetup_Creator.description_embed)
          .setFooter({ text: `${language_result.selectSetup_Creator.embed_footer}`, iconURL: `${language_result.selectSetup_Creator.embed_icon_url}` })
          .setColor(0x9ba832);
        await interaction.message.delete();
        await interaction.reply({ embeds: [embedLog], components: [row] });

      }

      if (interaction.customId == 'autoVoiceSelectMenu_creatorType') {
        let value = interaction.values;
        await value.forEach(async v => {
          let typeAccess;
          switch (v) {
            case "private":
              typeAccess = 1;
              break;
            case "free":
              typeAccess = 2;
              break;

          }
          await runDb(`UPDATE autovoice_system_creator SET creatorType = ?`, typeAccess);
        });
        // RISPONDO ALL'INTERAZIONE ELIMINO IL MESSAGGIO E NE RICREO UNO NUOVO
        const voiceNumber = await getEmoji(interaction.client, "voiceNumber");
        const voiceUser = await getEmoji(interaction.client, "voiceUser");
        const voiceRandom = await getEmoji(interaction.client, "voiceRandom");
        const selectSetup_TypeAccess = new StringSelectMenuBuilder()
          .setCustomId('autoVoiceSelectMenu_accessType')
          .setPlaceholder(language_result.selectSetup_TypeAccess.placeholder)
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel(language_result.selectSetup_TypeAccess.label_numeric)
              .setValue("numeric")
              .setEmoji(voiceNumber.id),
            new StringSelectMenuOptionBuilder()
              .setLabel(language_result.selectSetup_TypeAccess.label_nickname)
              .setValue("nickname")
              .setEmoji(voiceUser.id),
            new StringSelectMenuOptionBuilder()
              .setLabel(language_result.selectSetup_TypeAccess.label_random)
              .setValue("random")
              .setEmoji(voiceRandom.id),
          );

        const row = new ActionRowBuilder()
          .addComponents(selectSetup_TypeAccess);

        const customEmoji = await getEmojifromUrl(interaction.client, "utilitysettings")
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.selectSetup_TypeAccess.embed_title}`, iconURL: customEmoji })
          .setDescription(language_result.selectSetup_TypeAccess.description_embed)
          .setFooter({ text: `${language_result.selectSetup_TypeAccess.embed_footer}`, iconURL: `${language_result.selectSetup_TypeAccess.embed_icon_url}` })
          .setColor(0x9ba832);
        await interaction.message.delete();
        await interaction.reply({ embeds: [embedLog], components: [row] });

      }

    }
    catch (error) {
      console.log(error)
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\autoVoice-system\\autovoiceinteractions.js");
    }
  },
};