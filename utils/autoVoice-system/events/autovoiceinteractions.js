// Code: utils/autoVoice-system/events/autovoiceinteractions.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file autovoiceinteractions.js
 * @module autovoiceinteractions
 * @description Questo file contiene gli eventi per la gestione delle interazioni del sistema di auto voice
 */

const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ApplicationEmoji } = require('discord.js');
const fs = require('fs');
const language = require('../../../languages/languages');
const { errorSendControls, getEmojifromUrl, getEmoji, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const emoji = require('../../../bin/data/emoji');
const color = require('../../../bin/data/colors');
const Variables = require('../../../bin/classes/GlobalVariables');
const { findAutoVoiceByChannelId, createAutoVoice } = require('../../../bin/service/DatabaseService');
const { checkPremiumFeature } = require('../../../bin/functions/checkPremiumFeature');


// FUNZIONI

async function endSetup(language_result, interaction, variables) {
  const data = fs.readFileSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
  jsonData = JSON.parse(data);


  if (jsonData.type != 2) {
    const size = interaction.fields.getTextInputValue('sizeSelectAutoVoice');
    let regex = /^[0-9]+$/;
    if (regex.test(size)) {
      await interaction.deferReply();
    }
  }
  const category = await interaction.guild.channels.fetch(jsonData.category);
  // CREAZIONE DEL CANALE
  let channelObject = {};

  // SE IL AUTO VOICE E' AUTOMATICO
  if (jsonData.type == 2) {
    // CANALE NUMERICO
    if (jsonData.creator == 2) {
      channelObject = {
        parent: category,
        name: `changeMe 1`,
        type: ChannelType.GuildVoice
      };
    }
  }

  await interaction.guild.channels.create(channelObject);
  await createAutoVoice(interaction.guild.id, jsonData.type, jsonData.category, jsonData.creator, variables);

  // INVIO MESSAGGIO DI FINE SETUP E CANCELLO IL CANALE
  await interaction.channel.delete();
  const setupChannel = await interaction.guild.channels.fetch(jsonData.channel_start);
  fs.unlinkSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);

  const embedLog = new EmbedBuilder()
    .setDescription(`## ${language_result.endSetup_message.embed_title}\n` + language_result.endSetup_message.description_embed)
    .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
    .setThumbnail(variables.getBotFooterIcon())
    .setColor(color.general.olive);
  await setupChannel.send({ embeds: [embedLog] });
}


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, variables) {
    if (!interaction.guild) return;

    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id, variables);
      const langagues_path = fs.readFileSync(`./languages/autoVoice-system/${data}.json`);
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

          }
          const filePath = `./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`;
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              fs.unlinkSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
              return;
            }

            let jsonData;
            try {
              jsonData = JSON.parse(data);
            } catch (parseErr) {
              fs.unlinkSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
              return;
            }

            // 3. Aggiungi le opzioni desiderate
            jsonData.type = typeVoice;

            // 4. Salva il file aggiornato
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
            });
          });
        });
        // RISPONDO ALL'INTERAZIONE ELIMINO IL MESSAGGIO E NE RICREO UNO NUOVO
        const privateEmoji = emoji.autoVoiceSystem.private;
        const freeEmoji = emoji.autoVoiceSystem.free;
        const selectSetup_Creator = new StringSelectMenuBuilder()
          .setCustomId('autoVoiceSelectMenu_creatorType')
          .setPlaceholder(language_result.selectSetup_Creator.placeholder)
          .addOptions(
            // new StringSelectMenuOptionBuilder() //DA PROGRAMMARE
            //   .setLabel(language_result.selectSetup_Creator.label_private)
            //   .setValue("private")
            //   .setEmoji(privateEmoji.id),
            new StringSelectMenuOptionBuilder()
              .setLabel(language_result.selectSetup_Creator.label_free)
              .setValue("free")
          );

        const row = new ActionRowBuilder()
          .addComponents(selectSetup_Creator);

        const embedLog = new EmbedBuilder()
          .setDescription(`## ${language_result.selectSetup_Creator.embed_title}\n` + language_result.selectSetup_Creator.description_embed)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setThumbnail(variables.getBotFooterIcon())
          .setColor(color.general.olive);
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
          const filePath = `./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`;
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              fs.unlinkSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
              return;
            }

            let jsonData;
            try {
              jsonData = JSON.parse(data);
            } catch (parseErr) {
              fs.unlinkSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
              return;
            }

            // 3. Aggiungi le opzioni desiderate
            jsonData.creator = typeAccess;

            // 4. Salva il file aggiornato
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
            });
          });
        });
        // RISPONDO ALL'INTERAZIONE ELIMINO IL MESSAGGIO E NE RICREO UNO NUOVO
        // const voiceNumber = await getEmoji(interaction.client, "voiceNumber");
        // const voiceUser = await getEmoji(interaction.client, "voiceUser");
        // const voiceRandom = await getEmoji(interaction.client, "voiceRandom");
        const selectSetup_TypeAccess = new StringSelectMenuBuilder()
          .setCustomId('autoVoiceSelectMenu_accessType')
          .setPlaceholder(language_result.selectSetup_TypeAccess.placeholder)
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel(language_result.selectSetup_TypeAccess.label_numeric)
              .setValue("numeric")
            // new StringSelectMenuOptionBuilder() //DA PROGRAMMARE
            //   .setLabel(language_result.selectSetup_TypeAccess.label_nickname)
            //   .setValue("nickname")
            //   .setEmoji(voiceUser.id),
            // new StringSelectMenuOptionBuilder()
            //   .setLabel(language_result.selectSetup_TypeAccess.label_random)
            //   .setValue("random")
            //   .setEmoji(voiceRandom.id),
          );

        const row = new ActionRowBuilder()
          .addComponents(selectSetup_TypeAccess);

        const embedLog = new EmbedBuilder()
          .setDescription(`## ${language_result.selectSetup_TypeAccess.embed_title}\n` + language_result.selectSetup_TypeAccess.description_embed)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setThumbnail(variables.getBotFooterIcon())
          .setColor(color.general.olive);
        await interaction.message.delete();
        await interaction.reply({ embeds: [embedLog], components: [row] });

      }

      if (interaction.customId == "autoVoiceSelectMenu_accessType") {
        let value = interaction.values;
        await value.forEach(async v => {
          let typeNickname;
          switch (v) {
            case "numeric":
              typeNickname = 1;
              break;
            case "nickname":
              typeNickname = 2;
              break;
            case "random":
              typeNickname = 3;
              break;

          }
          const filePath = `./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`;
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              fs.unlinkSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
              return;
            }

            let jsonData;
            try {
              jsonData = JSON.parse(data);
            } catch (parseErr) {
              fs.unlinkSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
              return;
            }

            // 3. Aggiungi le opzioni desiderate
            jsonData.nickname = typeNickname;

            // 4. Salva il file aggiornato
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
            });
          });
        });
        const selectSetup_Creator = new ChannelSelectMenuBuilder()
          .setCustomId('autoVoiceSelectMenu_creatorCategory')
          .setPlaceholder(language_result.select_category.placeholder)
          .setChannelTypes(ChannelType.GuildCategory);


        const row = new ActionRowBuilder()
          .addComponents(selectSetup_Creator);

        const embedLog = new EmbedBuilder()
          .setDescription(`## ${language_result.select_category.embed_title}\n` + language_result.select_category.description_embed)
          .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
          .setThumbnail(variables.getBotFooterIcon())
          .setColor(color.general.olive);
        await interaction.message.delete();
        await interaction.reply({ embeds: [embedLog], components: [row] });
      }



      if (interaction.customId == "autoVoiceSelectMenu_creatorCategory") {
        const data = fs.readFileSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
        jsonData = JSON.parse(data);

        // CONTROLLO SE LA CATEGORIA ESISTE GIA'
        
        let checkCategory = await findAutoVoiceByChannelId(interaction.guild.id, interaction.values[0], variables);
        checkCategory = checkCategory?.get({plain: true}) ?? false;
        if (checkCategory) {
          await interaction.channel.delete();
          const setupChannel = await interaction.guild.channels.fetch(jsonData.channel_start);

          const embedLog = new EmbedBuilder()
            .setDescription(`## ${language_result.endSetup_message.embed_title}\n` + language_result.endSetup_message.description_embed_errorcategory)
            .setFooter({ text: `${variables.getBotFooter()}`, iconURL: `${variables.getBotFooterIcon()}` })
            .setThumbnail(variables.getBotFooterIcon())
            .setColor(color.general.error);
          await setupChannel.send({ embeds: [embedLog] });
          fs.unlinkSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
          return;
        }

        const filePath = `./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`;
        async function writeFileAsync() {
          try {
            // Leggi il file
            let data;
            try {
              data =  fs.readFileSync(filePath);
            } catch (err) {
              // Se il file non esiste o c'è un errore di lettura, rimuovi il file e termina
              await fs.unlinkSync(filePath); // Ignora l'errore se il file non esiste
              return;
            }

            // Parsea i dati JSON
            let jsonData;
            try {
              jsonData = JSON.parse(data);
            } catch (parseErr) {
              // Se il parsing fallisce, elimina il file e termina
              await fs.unlinkSync(filePath);
              return;
            }

            jsonData.category = interaction.values[0];

            await fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
          } catch (error) {
            console.error('Errore nella gestione del file:', error);
          }
        }

        await writeFileAsync();
        if (data.type == 2) {
          await endSetup(language_result, interaction, variables);
        }


        if (data.type == 1) {
          await endSetup(language_result, interaction, variables);
        } else {
          await endSetup(language_result, interaction, variables);
        }
      }

    }
    catch (error) {
      console.log(error)
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\autoVoice-system\\autovoiceinteractions.js", variables);
    }
  },
};