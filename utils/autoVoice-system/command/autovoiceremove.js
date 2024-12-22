const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const fs = require('fs');
const { readDb, runDb, readDbAllWith2Params } = require('../../../bin/database');
const { errorSendControls, getEmoji, returnPermission, noInitGuilds, noHavePermission, noEnabledFunc, getEmojifromUrl } = require('../../../bin/HandlingFunctions');
const colors = require('../../../bin/data/colors');
const emoji = require('../../../bin/data/emoji');
const Variables = require('../../../bin/classes/GlobalVariables');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const { findAutoVoiceById, removeAutoVoiceById } = require('../../../bin/service/DatabaseService');

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
      try {
        if (result) {
          let logsTable = await findAutoVoiceById(interaction.guild.id, autoVoiceId);
          checkTable = logsTable?.get({ plain: true });
          const embedLog = new EmbedBuilder();
          //CONTROLLO SE LA ROW E' PRESENTE NEL DB
          if (checkTable) {
            // SE E' PRESENTE NEL DB LA ELIMINA E MOSTRA UN MESSAGGIO DI SUCCESSO
            customEmoji = emoji.general.trueMaker
            embedLog.setColor(colors.general.success);
            embedLog.setDescription(language_result.remove.success_description.replace("{0}", autoVoiceId));
            await removeAutoVoiceById({ id: checkTable.id, guild_id: interaction.guild.id });

          } else {
            // SE NON E' PRESENTE NEL DB MOSTRA UN ERRORE
            customEmoji = emoji.general.errorMarker
            embedLog.setColor(colors.general.error);
            embedLog.setDescription(language_result.remove.error_description);
          }
          embedLog.setTitle(language_result.remove.embed_title);
          embedLog.setAuthor({ name: `${language_result.remove.embed_title}`, iconURL: customEmoji })
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