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
	"logSystem_enabled"	INTEGER,
	"ticketSystem_enabled"	INTEGER,
	"autoVoiceSystem_enabled"	INTEGER,
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
```