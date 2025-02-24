const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { errorSendControls, returnPermission, noHavePermission } = require('../../../bin/HandlingFunctions');
const { allCheckFeatureForCommands } = require('../../../bin/functions/allCheckFeatureForCommands');
const color = require('../../../bin/data/colors');
const { findUserReportsById, findUserById, addUserGuild } = require('../../../bin/service/DatabaseService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whoise')
    .setDescription('Use this command to see the information of a user.')
    .setDescriptionLocalization("it", "Usa questo comando per vedere le informazioni di un utente.")
    .addUserOption(user =>
      user
        .setName('member')
        .setDescription('The role to insert into the list autorole')
        .setDescriptionLocalization("it", "Il membro da cercare nel server")
        .setRequired(true)
    ),
  async execute(interaction, variables) {
    const user = interaction.options.data[0].user;

    // RECUPERO LA LINGUA
    let data = await language.databaseCheck(interaction.guild.id, variables);
    const langagues_path = readFileSync(`./languages/general/${data}.json`);
    const language_result = JSON.parse(langagues_path);
    // CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
    try {

      let userReports = await findUserReportsById(user.id);
      let userFromDb = await findUserById(user.id);
      userFromDb = userFromDb?.get({ plain: true });
      let member = await interaction.guild.members.fetch(user.id);

      if (!userFromDb) {
        await addUserGuild(user.id, interaction.guild.id, member.user.username, variables);
        userFromDb = await findUserById(user.id);
        userFromDb = userFromDb?.get({ plain: true });
      }

      let safeStatus = null;
      switch (userFromDb.state) {
        case 0:
          safeStatus = "🟢 Safe";
          break;
        case 1:
          safeStatus = "🟠 Unsafe";
          break;
        case 2:
          safeStatus = "🔴 Danger";
          break;
        case 3:
          safeStatus = "🔰 Partner";
          break;
        case 4:
          safeStatus = "🔱 VIP";
          break;
        case 5:
          safeStatus = "👮‍♂️ Staff";
          break;
      }

      const joinedTimestamp = Math.floor(member.joinedTimestamp / 1000);
      const createdTimestamp = Math.floor(member.user.createdTimestamp / 1000);

      let verifyReports = "";
      let unverifyReports = "";
      let countReports = { verify: 0, unverify: 0 };
      if (userReports) {
        userReports.forEach(report => {
          report = report?.get({ plain: true });
          let type = report.reports == 0 ? "Ban" : "Warn";
          countReports[report.isVerified == 1 ? "verify" : "unverify"]++;

          if (report.isVerified == 1 && countReports.verify <= 5) {
            verifyReports += `• (${type}) - ${report.reason ?? "No data"} ${report.guild_id == interaction.guild.id ? "| (questo server)" : ""}\n`;
          }
          else if (report.isVerified == 0 && countReports.unverify <= 5) {
            unverifyReports += `• (${type}) - ${report.reason ?? "No data"} ${report.guild_id == interaction.guild.id ? "| (questo server)" : ""}\n`;
          }
        });

        if (countReports.verify > 5) {
          verifyReports += `• ... ${language_result.whoisCommand.and_others} ${countReports.verify - 5} ${language_result.whoisCommand.verified_report}\n`;
        }
        if (countReports.unverify > 5) {
          unverifyReports += `• ... ${language_result.whoisCommand.and_others} ${countReports.unverify - 5} ${language_result.whoisCommand.unverified_report}\n`;
        }

        if (countReports.verify == 0) verifyReports = `• ${language_result.whoisCommand.no_report}\n`;
        if (countReports.unverify == 0) unverifyReports = `• ${language_result.whoisCommand.no_report}\n`;
      }

      const embed = new EmbedBuilder()
        .setDescription(`## ${language_result.whoisCommand.embed_title}`)
        .setColor(color.general.aquamarine)
        .addFields(
          {
            name: language_result.whoisCommand.general_info,
            value: `*${language_result.whoisCommand.user_name}*:\n${member.user.username}\n*Nickname*:\n${member.nickname || member.user.username}\n`, inline: true
          },
          { name: "‎", value: `*${language_result.whoisCommand.user_joined}*:\n<t:${joinedTimestamp}:R>\n*${language_result.whoisCommand.user_created}*:\n<t:${createdTimestamp}:R>`, inline: true },
          { name: language_result.whoisCommand.others_info, value: `*Voice State*:\n${member.voice.channel ? member.voice.channel : '🔴 offline'}\n*${language_result.whoisCommand.last_boost}*:\n${member.premiumSince || 'N/A'}`, inline: false },
          { name: "Community Info", value: `*${language_result.whoisCommand.user_status}*: \n${safeStatus}` },
          { name: "‎", value: "‎", inline: false },
          { name: language_result.whoisCommand.verified_storyline, value: verifyReports },
          { name: language_result.whoisCommand.unverified_storyline, value: unverifyReports },
        )
        .setFooter({ text: `id: ${member.id}`, iconURL: `${variables.getBotFooterIcon()}` })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

      await interaction.reply({ embeds: [embed], flags: 64 });
    }
    catch (error) {
      errorSendControls(error, interaction.client, interaction.guild, "\\general-system\\whoise.js", variables);
    }
  },
};