const { Events, EmbedBuilder, TextChannel } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const { readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl } = require('../../../bin/HandlingFunctions');

// QUERY DEFINITION
let sqlChannelId_log = `SELECT guildAuditLogs_channel FROM log_system_config WHERE guildId = ?`;
let sqlEnabledFeature = `SELECT logSystem_enabled FROM guilds_config WHERE guildId = ?`;
// ------------ //

module.exports = { // HO DISABILITATO QUESTA FUNZIONE MODIFICANDO IL NOME EVENTO
  name: Events.GuildAuditLogEntryCreat,
  async execute(auditLogEntry, guild) {
    let customEmoji = await getEmojifromUrl(guild.client, "auditlog");
    // CONTROLLO SE LA FUNZIONE E' ABILITATA
    const result_Db = await readDb(sqlEnabledFeature, guild.id);
    try {
      if (!result_Db) return;
      if (result_Db.logSystem_enabled != 1) return;
      // CERCO L'ID DEL CANALE DI LOG NEL DATABASE
      const result = await readDb(sqlChannelId_log, guild.id);
      if (!result?.guildAuditLogs_channel) return;
      if (result.guildAuditLogs_channel?.length < 5) return;
      // CONTROLLO DELLA LINGUA
      if (guild?.id) {
        let data = await language.databaseCheck(guild.id);
        const langagues_path = readFileSync(`./languages/logs-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);

        let channel_logs = await guild.channels.fetch(result.guildAuditLogs_channel);
        const fields = [];
        if (auditLogEntry.executorId.length > 0) {
          let member = await guild.members.fetch(auditLogEntry.executorId);
          fields.push({ name: `${language_result.guildAuditLogsEntry.log_executor}`, value: `${member}`, inline: true }, { name: `${language_result.guildAuditLogsEntry.id_executor}`, value: `${member.id}`, inline: true });
        }
        // ACTION DEFINITION
        switch (auditLogEntry.action) {
          case 121:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `ApplicationCommandPermissionUpdate` });
            break;
          case 143:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `AutoModerationBlockMessage` });
            break;
          case 144:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `AutoModerationFlagToChannel` });
            break;
          case 140:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `AutoModerationRuleCreate` });
            break;
          case 142:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `AutoModerationRuleDelete` });
            break;
          case 141:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `AutoModerationRuleUpdate` });
            break;
          case 145:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `AutoModerationUserCommunicationDisabled` });
            break;
          case 28:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `BotAdd` });
            break;
          case 10:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `ChannelCreate` });
            break;
          case 12:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `ChannelDelete` });
            break;
          case 13:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `ChannelOverwriteCreate` });
            break;
          case 15:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `ChannelOverwriteDelete` });
            break;
          case 14:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `ChannelOverwriteUpdate` });
            break;
          case 11:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `ChannelUpdate` });
            break;
          case 150:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `CreatorMonetizationRequestCreated` });
            break;
          case 151:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `CreatorMonetizationTermsAccepted` });
            break;
          case 60:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `EmojiCreate` });
            break;
          case 62:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `EmojiDelete` });
            break;
          case 61:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `EmojiUpdate` });
            break;
          case 100:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `GuildScheduledEventCreate` });
            break;
          case 102:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `GuildScheduledEventDelete` });
            break;
          case 101:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `GuildScheduledEventUpdate` });
            break;
          case 1:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `GuildUpdate` });
            break;
          case 80:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `IntegrationCreate` });
            break;
          case 82:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `IntegrationDelete` });
            break;
          case 81:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `IntegrationUpdate` });
            break;
          case 40:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `InviteCreate` });
            break;
          case 42:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `InviteDelete` });
            break;
          case 41:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `InviteUpdate` });
            break;
          case 22:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MemberBanAdd` });
            break;
          case 23:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MemberBanRemove` });
            break;
          case 27:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MemberDisconnect` });
            break;
          case 20:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MemberKick` });
            break;
          case 26:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MemberMove` });
            break;
          case 21:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MemberPrune` });
            break;
          case 25:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MemberRoleUpdate` });
            break;
          case 24:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MemberUpdate` });
            break;
          case 73:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MessageBulkDelete` });
            break;
          case 72:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MessageDelete` });
            break;
          case 74:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MessagePin` });
            break;
          case 75:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `MessageUnpin` });
            break;
          case 30:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `RoleCreate` });
            break;
          case 32:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `RoleDelete` });
            break;
          case 31:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `RoleUpdate` });
            break;
          case 83:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `StageInstanceCreate` });
            break;
          case 85:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `StageInstanceDelete` });
            break;
          case 84:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `StageInstanceUpdate` });
            break;
          case 90:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `StickerCreate` });
            break;
          case 92:
            fields.push({
              name: `${language_result.guildAuditLogsEntry.action}`, value: `StickerDelete`
            });
            break;
          case 91:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `StickerUpdate` });
            break;
          case 110:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `ThreadCreate` });
            break;
          case 112:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `ThreadDelete` });
            break;
          case 111:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `ThreadUpdate` });
            break;
          case 50:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `WebhookCreate` });
            break;
          case 52:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `WebhookDelete` });
            break;
          case 51:
            fields.push({ name: `${language_result.guildAuditLogsEntry.action}`, value: `WebhookUpdate` });
            break;
        }

        fields.push({ name: " ", value: " " });
        switch (auditLogEntry.targetType) {
          case "Guild":
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_embed}`, value: `${language_result.guildAuditLogsEntry.target_guild}`, inline: true });
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_embed_guild_id}`, value: `${auditLogEntry.targetId}`, inline: true });
            break;
          case "Channel":
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_embed}`, value: `${auditLogEntry.target}`, inline: true });
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_embed_channel_id}`, value: `${auditLogEntry.targetId}`, inline: true });
            break;
          case "User":
            let user = await guild.members.fetch(auditLogEntry.targetId)
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_embed}`, value: `${user}`, inline: true });
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_embed_user_id}`, value: `${auditLogEntry.targetId}`, inline: true });
            break;
          case "Role":
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_embed}`, value: `${auditLogEntry.target}`, inline: true });
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_embed_role_id}`, value: `${auditLogEntry.targetId}`, inline: true });
            break;
          case "Invite":
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_embed_invite}`, value: `${auditLogEntry.target}`, inline: true });
            break;
          case "Webhook":
            break;
          case "Emoji":
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_embed_emoji_id}`, value: `${auditLogEntry.target.id}`, inline: true });
            break;
          case "Message":
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_channel}`, value: `${auditLogEntry.extra.channel}`, inline: true });
            fields.push({ name: `${language_result.guildAuditLogsEntry.target_message_id}`, value: `${auditLogEntry.extra.messageId}`, inline: true });
            break;
          case "Integration":
            break;
          case "StageInstance":
            break;
          case "Sticker":
            break;
          case "Thread":
            break;
          case "GuildScheduledEvent":
            break;
          case "ApplicationCommandPermission":
            break;
        }
        fields.push({ name: `${language_result.guildAuditLogsEntry.target_changes_embed}`, value: `ID: (${auditLogEntry.id})` });
        if (auditLogEntry.changes.length > 0) {
          fields.push({ name: "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯", value: " " });
          auditLogEntry.changes.forEach((values, index) => {
            if (fields.length < 22) {
              fields.push({ name: `[${index}] ${language_result.guildAuditLogsEntry.target_changes_key}`, value: `${values.key}` });
              if (typeof values.old == 'object') {
                values.old.forEach(oldValue => {
                  fields.push({ name: `[${index}] ${language_result.guildAuditLogsEntry.target_changes_old}`, value: `${JSON.stringify(oldValue)}` });
                });
              } else {
                fields.push({ name: `[${index}] ${language_result.guildAuditLogsEntry.target_changes_old}`, value: `${values.old}` });
              }
              if (typeof values.new == 'object') {
                values.new.forEach(newValue => {
                  fields.push({
                    name: `[${index}] ${language_result.guildAuditLogsEntry.target_changes_new}`, value: `- ${JSON.stringify(newValue)
                      .replace("{", " ")
                      .replace("}", " ")
                      .replace(",", "  ")}`
                  });
                  fields.push({ name: "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯", value: " " });
                });
              } else {
                fields.push({ name: `[${index}] ${language_result.guildAuditLogsEntry.target_changes_new}`, value: `${values.new}` });
                fields.push({ name: "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯", value: " " });
              }
            }
          });
        } else {
          fields.push({ name: ` `, value: `${language_result.guildAuditLogsEntry.nochanges}` });
        }

        fields.forEach(field => {
          if (field.value == "undefined") {
            field.value = language_result.guildAuditLogsEntry.undefined;
          }
        })
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.guildAuditLogsEntry.embed_title}`, iconURL: customEmoji })
          .addFields(fields)
          .setFooter({ text: `${language_result.guildAuditLogsEntry.embed_footer}`, iconURL: `${language_result.guildAuditLogsEntry.embed_icon_url}` })
          .setColor(0x49207d);
        channel_logs.send({ embeds: [embedLog] });
      }
    }
    catch (error) {
      errorSendControls(error, guild.client, guild, "\\logs_system\\GuildAuditLogsEntry.js");
    }
  },
};