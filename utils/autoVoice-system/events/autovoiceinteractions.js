const { Events, ChannelSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ApplicationEmoji } = require('discord.js');
const fs = require('fs');
const language = require('../../../languages/languages');
const { readDbAllWith2Params, runDb, readDbWith3Params, readDbWith4Params, readDb, readDbAll } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, getEmoji, returnPermission, noHavePermission, noEnabledFunc } = require('../../../bin/HandlingFunctions');
const emoji = require('../../../bin/data/emoji');
const color = require('../../../bin/data/colors');


// FUNZIONI

async function endSetup(language_result, interaction) {
  const data = fs.readFileSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
  jsonData = JSON.parse(data);


  if (jsonData.type != 2) {
    const size = interaction.fields.getTextInputValue('sizeSelectAutoVoice');
    let regex = /^[0-9]+$/;
    if (regex.test(size)) {
      await interaction.deferReply();
    }
  }
  const category = await interaction.guild.channels.fetch(data.category);
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
  await runDb(`INSERT INTO auto_voice (guilds_id, type, channel_id, nickname) VALUES(?,?,?,?)`, interaction.guild.id, jsonData.type, jsonData.category, jsonData.creator);

  // INVIO MESSAGGIO DI FINE SETUP E CANCELLO IL CANALE
  await interaction.channel.delete();
  const setupChannel = await interaction.guild.channels.fetch(jsonData.channel_start);
  fs.unlinkSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);

  const customEmoji = emoji.general.utility
  const embedLog = new EmbedBuilder()
    .setAuthor({ name: `${language_result.endSetup_message.embed_title}`, iconURL: customEmoji })
    .setDescription(language_result.endSetup_message.description_embed)
    .setFooter({ text: `${language_result.endSetup_message.embed_footer}`, iconURL: `${language_result.endSetup_message.embed_icon_url}` })
    .setColor(color.general.olive);
  await setupChannel.send({ embeds: [embedLog] });
}


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.guild) return;
    try {
      // CONTROLLO LINGUA
      let data = await language.databaseCheck(interaction.guild.id);
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

        const customEmoji = emoji.general.utility
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.selectSetup_Creator.embed_title}`, iconURL: customEmoji })
          .setDescription(language_result.selectSetup_Creator.description_embed)
          .setFooter({ text: `${language_result.selectSetup_Creator.embed_footer}`, iconURL: `${language_result.selectSetup_Creator.embed_icon_url}` })
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

        const customEmoji = emoji.general.utility
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.selectSetup_TypeAccess.embed_title}`, iconURL: customEmoji })
          .setDescription(language_result.selectSetup_TypeAccess.description_embed)
          .setFooter({ text: `${language_result.selectSetup_TypeAccess.embed_footer}`, iconURL: `${language_result.selectSetup_TypeAccess.embed_icon_url}` })
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

        const customEmoji = emoji.general.utility
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.select_category.embed_title}`, iconURL: customEmoji })
          .setDescription(language_result.select_category.description_embed)
          .setFooter({ text: `${language_result.select_category.embed_footer}`, iconURL: `${language_result.select_category.embed_icon_url}` })
          .setColor(color.general.olive);
        await interaction.message.delete();
        await interaction.reply({ embeds: [embedLog], components: [row] });
      }



      if (interaction.customId == "autoVoiceSelectMenu_creatorCategory") {
        const data = fs.readFileSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
        jsonData = JSON.parse(data);

        // CONTROLLO SE LA CATEGORIA ESISTE GIA'
        const checkCategory = await readDb(`SELECT * FROM auto_voice WHERE guilds_id = ? AND channel_id = ?`, interaction.guild.id, interaction.values[0]);
        if (checkCategory) {
          await interaction.channel.delete();
          const setupChannel = await interaction.guild.channels.fetch(jsonData.channel_start);

          const customEmoji = emoji.general.errorMarker;
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.endSetup_message.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.endSetup_message.description_embed_errorcategory)
            .setFooter({ text: `${language_result.endSetup_message.embed_footer}`, iconURL: `${language_result.endSetup_message.embed_icon_url}` })
            .setColor(color.general.error);
          await setupChannel.send({ embeds: [embedLog] });
          fs.unlinkSync(`./utils/autoVoice-system/${interaction.guild.id}_${interaction.user.id}.json`);
          return;
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
          jsonData.category = interaction.values[0];

          // 4. Salva il file aggiornato
          fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
          });
        });
        if (data.type == 2) {
          endSetup(language_result, interaction);
        }

        const modal = new ModalBuilder()
          .setCustomId("autoVoiceModalSelectSize")
          .setTitle(language_result.select_size.embed_title);

        const sizeSelect = new TextInputBuilder()
          .setCustomId('sizeSelectAutoVoice')
          .setLabel(language_result.select_size.label)
          .setPlaceholder(language_result.select_size.placeholder)
          .setStyle(TextInputStyle.Short)
          .setMaxLength(2)

        if (data.type == 1) {
          const messageSelect = new TextInputBuilder()
            .setCustomId('messageSelectAutoVoice')
            .setLabel(language_result.select_size.label_message)
            .setPlaceholder(language_result.select_size.placeholder_message)
            .setStyle(TextInputStyle.Paragraph)
          const row = new ActionRowBuilder().addComponents(sizeSelect);
          const row2 = new ActionRowBuilder().addComponents(messageSelect);
          modal.addComponents(row, row2);
        } else {

          const row = new ActionRowBuilder().addComponents(sizeSelect);
          modal.addComponents(row);
        }


        await interaction.showModal(modal);
      }

      if (interaction.customId == "autoVoiceModalSelectSize") {
        await endSetup(language_result, interaction);
      }

    }
    catch (error) {
      console.log(error)
      errorSendControls(error, interaction.guild.client, interaction.guild, "\\autoVoice-system\\autovoiceinteractions.js");
    }
  },
};