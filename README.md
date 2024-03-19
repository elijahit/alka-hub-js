## Alka Hub Network


# CONFIG FILE

File di configurazione da chiamare config.json e inserire nella root directory, esente da token.
```json
{
  "token": "",
  "clientId": "843183839869665280",
  "guildMainId": "1025041232872882196",
  "guildMainChannelsControlsError": "1206278810425888788",
  "emojiGuildId_01": "1208551768116564059",
  "presenceStatusName": "ALKA HUB - WIP",
  "botState": "(Early Access) - Read Desc"
}
```

```sql
-- Tabella di configurazione Server
CREATE TABLE "guilds_config" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"languages"	TEXT,
	"timeZone"	TEXT,
	"logSystem_enabled"	INTEGER,
	"rankSystem_enabled"	INTEGER,
	"ticketSystem_enabled"	INTEGER,
	"autoVoiceSystem_enabled"	INTEGER,
	"autoRoleSystem_enabled"	INTEGER,
	"reactionRoleSystem_enabled"	INTEGER,
	"statsServerSystem_enabled"	INTEGER,
	"twitchNotifySystem_enabled"	INTEGER,
	"youtubeNotifySystem_enabled"	INTEGER,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di configurazione Log System
CREATE TABLE "log_system_config" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"voiceStateJoin_channel"	TEXT,
	"channelState_channel"	TEXT,
	"guildAuditLogs_channel"	TEXT,
	"emojiState_channel"	TEXT,
	"guildBanState_channel"	TEXT,
	"guildMemberState_channel"	TEXT,
	"guildState_channel"	TEXT,
	"inviteState_channel"	TEXT,
	"messageState_channel"	TEXT,
	"addMember_channel"	TEXT,
	"removeMember_channel"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella raccolta hash consentiti per Rank System
CREATE TABLE "rank_system_hash" (
	"ID"	INTEGER UNIQUE,
	"hashName"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta permessi dei vari server
CREATE TABLE "rank_system_permissions" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"roleId"	TEXT,
	"hashRank"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta messaggi di Ticket System
CREATE TABLE "ticket_system_message" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"channelId"	TEXT,
	"messageId"	TEXT,
	"categoryId"	TEXT,
	"transcriptId"	TEXT,
	"initAuthorId"	TEXT,
	"initDescription"	TEXT,
	"initTitle"	TEXT,
	"initChannel"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta ticket di Ticket System
CREATE TABLE "ticket_system_tickets" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"authorId"	TEXT,
	"messageId"	TEXT,
	"ticketPrefix"	TEXT,
	"ticketSystemMessage_Id"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta Auto Voice System
CREATE TABLE "autovoice_system_creator" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"authorId"	TEXT,
	"categoryId"	TEXT,
	"channelId"	INTEGER,
	"typeVoice"	INTEGER,
	"messageText"	TEXT,
	"creatorType"	INTEGER,
	"creatorNickname"	INTEGER,
	"channelSize"	INTEGER,
	"initChannel"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta Auto Role System
CREATE TABLE "autorole_system_roles" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"roleId"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta Reaction Role System
CREATE TABLE "reactionrole_system_reactions" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"roleId"	TEXT,
	"messageId"	TEXT,
	"channelId"	TEXT,
	"emoji"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta categorie Stats System
CREATE TABLE "stats_system_category" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"categoryId"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta canali Stats System
CREATE TABLE "stats_system_channel" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"categoryId"	TEXT,
	"channelId"	TEXT,
	"typeChannel"	INTEGER,
	"markdown"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
--- Tabella di raccolta canali Twitch Notify
CREATE TABLE "twitch_notify_system" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"channelId"	TEXT,
	"streamerId"	TEXT,
	"streamerName"	TEXT,
	"sendMessage"	INTEGER,
	"roleMention"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
--- Tabella di raccolta listner Twitch
CREATE TABLE "twitch_streamers_system" (
	"ID"	INTEGER UNIQUE,
	"streamerId"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
--- Tabella di raccolta canali Youtube Notify
CREATE TABLE "youtube_channels_system" (
	"ID"	INTEGER UNIQUE,
	"channelId"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
--- Tabella di raccolta listner youtube
CREATE TABLE "youtube_notify_system" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"channelId"	TEXT,
	"youtuberId"	TEXT,
	"youtuberName"	TEXT,
	"sendMessage"	INTEGER,
	"roleMention"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta video notificati
CREATE TABLE "youtube_video_system" (
	"ID"	INTEGER UNIQUE,
	"videoId"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta music bot
CREATE TABLE "music_queue_system" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"voiceChannelId"	TEXT,
	"name"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
-- Tabella di raccolta voti
CREATE TABLE "music_vote_system" (
	"ID"	INTEGER UNIQUE,
	"guildId"	TEXT,
	"actions"	TEXT,
	"userId"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
```