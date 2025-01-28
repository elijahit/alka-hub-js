---
sidebar_position: 1
description: The Log System is a crucial tool for tracking, analyzing, and managing all activities within a Discord server, ensuring systematic and detailed traceability.
---
# Logs System

## Introduction

The Log System represents an essential resource for every Discord server, providing a solid foundation for tracking, analyzing, and managing all activities that occur within it. Operating as a kind of digital diary, this system allows for systematic and orderly recording of every action performed within the server, ensuring complete and detailed traceability.

Information within the Log System is organized through categorized channels, allowing for a logical and structured division of data. This approach greatly facilitates the consultation and management of information, enabling administrators to quickly access specific categories of activity and analyze recorded data in detail.

By activating the Log System on your server, you will benefit from numerous advantages. Firstly, you will have the ability to track crucial activities such as member access, server settings changes, moderation actions, and more. This will enable you to maintain constant control over your server's environment and intervene promptly when necessary.

**In parentheses (state) in the subtitle are contained references to the command for assigning the logs system.**


## Emoji Status

### Emoji Create (EmojiState)

The EmojiCreate feature represents a fundamental addition to your Discord server, allowing you to track every added emoji and reproduce a corresponding event in the designated log channel. This recording mechanism provides a clear and detailed view of the evolution of emojis within the server, offering an important resource for community management and maintenance. Whenever an emoji is added, the EmojiCreate feature captures this action and automatically generates an event in the specified log channel. This event includes crucial information such as the emoji's name, its unique ID, the emoji creator, and the time it was added. Additionally, the log can be customized to include additional desired details or specific information.

### Emoji Delete (EmojiState)

The EmojiDelete feature represents an important addition to your Discord server, allowing you to carefully monitor every removed emoji and record a corresponding event in the dedicated log channel. This tracking system provides a detailed and accurate view of changes made to emojis within the server, offering an important resource for community management and maintenance.

Whenever an emoji is removed, the EmojiDelete feature captures the event and automatically generates a record in the designated log channel. This record includes fundamental information such as the name of the deleted emoji, its unique ID, the responsible party for the removal, and the time the action was performed. Additionally, the log can be customized to include further details or specific desired information.

### Emoji Update (EmojiState)

The EmojiUpdate feature represents a crucial element for managing emojis within your Discord server, allowing you to track every modification made to emojis and generate a corresponding event in the default log channel. This monitoring system offers an important resource for server administrators, enabling them to maintain accurate and detailed control over changes made to emojis.

Whenever a modification is made to an existing emoji, the EmojiUpdate feature records the event and automatically generates a log in the designated log channel. This log contains essential information such as the name of the modified emoji, its unique ID, details of the modification made, and the time the action was performed. Additionally, the log can be customized to include further details or specific desired information.


## Ban Status

### Ban Add (BanState)

The BanAdd feature constitutes a fundamental element for managing the security and integrity of your Discord server, allowing you to track every ban imposed on users and generate a corresponding event in the designated log channel. This monitoring system provides administrators with an important resource to maintain a safe and respectful environment within the community.

Whenever a ban is assigned to a user, the BanAdd feature records the event and automatically creates a log in the specified log channel. This log includes essential information such as the unique identifier of the banned user, the reason for the ban, the responsible party for the decision, and the time the ban was executed. Additionally, the log can be customized to include further details or specific desired information.

### Ban Remove (BanState)

The BanRemove feature constitutes a crucial component for managing bans within your Discord server, allowing you to track every ban revoke for users and generate a corresponding event in the specified log channel. This monitoring system provides administrators with an important resource to manage and maintain order and security within the community.

Whenever a ban is revoked for a user, the BanRemove feature records the event and automatically creates a log in the designated log channel. This log contains essential information such as the unique identifier of the user affected, the reason for the ban revoke, the responsible party for the decision, and the time the ban revoke was executed. Additionally, the log can be customized to include further details or specific desired information.


## Voice Channel Activity

### VoiceState (VoiceState)

The VoiceState feature of the Log system is a fundamental component for monitoring activity in the voice channels of your Discord server. It tracks user joins, leaves, and movements within these channels, providing crucial information about user participation and interaction during voice sessions.

This tool is particularly useful for server administrators, as it allows them to have a comprehensive overview of ongoing voice activities and to intervene promptly if necessary. The collected information is sent to a specific textual channel, where it is presented in an Embed format. This format offers a clear and organized visualization of voice activities, facilitating understanding and data analysis.


## Member Status

### Member Add (AddMemberState)

The Member Add feature records whenever a new member joins your Discord server, providing an event log in the specified log channel. This tool is crucial for tracking member entry and can be used to monitor the activity of newcomers and ensure appropriate community welcoming. Make sure to enable this feature and properly configure the log channel to maintain an accurate and comprehensive record of member entry into your server.

### Member Remove (RemoveMemberState)

The Member Remove feature records whenever a member leaves your Discord server, generating an event in the specified log channel. This tool is essential for monitoring member activity and can be used to track departures from the community. Make sure to enable this feature and properly configure the log channel to maintain an accurate and comprehensive record of member exits from your server.

### Member Update (MemberState)

The Member Update feature tracks changes made to the names and roles of members within your Discord server, generating events in the specified log channel. This tool is valuable for monitoring and recording any changes in usernames or roles assigned to community members. Make sure to enable this feature and properly configure the log channel to maintain an accurate and comprehensive record of member changes in your server.


## Guild Status

### Guild Update (GuildState)

The Guild Update feature tracks changes made to the settings and configurations of the guild within your Discord server, generating events in the specified log channel. This tool is essential for monitoring and recording any changes in server settings, such as modifications to permissions, channel settings, or role configurations. Make sure to enable this feature and properly configure the log channel to maintain an accurate and comprehensive record of guild changes in your server.


## Invite Status

### Invite Create (InviteState)

The Invite Create feature tracks the creation of invites in your Discord server, generating events in the specified log channel. This tool is useful for monitoring and recording each time a new invite is created for the server. Make sure to enable this feature and properly configure the log channel to maintain an accurate and comprehensive record of invite creations in your server.

### Invite Delete (InviteState)

The Invite Delete feature tracks the deletion of invites in your Discord server, generating events in the specified log channel. This tool is useful for monitoring and recording each time an invite is removed from the server. Make sure to enable this feature and properly configure the log channel to maintain an accurate and comprehensive record of invite deletions in your server.


## Message Status

### Message Delete (MessageState)

The Message Delete feature tracks the deletion of messages within your Discord server, generating events in the specified log channel. This tool is useful for monitoring and recording each time a message is deleted, allowing administrators to maintain an accurate record of interactions on the server. Make sure to enable this feature and properly configure the log channel to maintain a comprehensive and detailed record of message deletions in your server.

### Message Update (MessageState)

The Message Update feature tracks the update of messages within your Discord server, generating events in the specified log channel. This tool is useful for monitoring and recording each time a message is edited after being sent, allowing administrators to track changes and revisions to messages by users. Make sure to enable this feature and properly configure the log channel to maintain an accurate and complete record of message updates in your server.

### Message Reaction Remove All (MessageState)

The Message Reaction Remove All feature tracks the removal of all reactions from a message within your Discord server, generating events in the specified log channel. This tool is useful for monitoring and recording each time all reactions are removed from a message, allowing administrators to track user interactions with messages on the server. Make sure to enable this feature and properly configure the log channel to maintain an accurate and complete record of removals of all reactions from a message in your server.


## Channel Status

### Channel Create (ChannelState)

The Channel Create feature tracks all events related to the creation of channels in your Discord server, differentiated by type. This tool is useful for monitoring and recording each time a new channel is created, whether it's text, voice, or category. Make sure to enable this feature and properly configure the log channel to maintain an accurate and complete record of channel creations in your server.

### Channel Delete (ChannelState)

The Channel Delete feature tracks all events related to the deletion of channels in your Discord server, differentiated by type. This tool is useful for monitoring and recording each time a channel is deleted, whether it's text, voice, or category. Make sure to enable this feature and properly configure the log channel to maintain an accurate and complete record of channel deletions in your server.

### Channel Update (ChannelState)

The Channel Update feature allows monitoring of all changes made to channels in the Discord server, offering a valuable tool for tracking and optimal community management. This tool is useful for tracking every change made to channels, such as changes to name, description, permissions, or other settings, allowing administrators to maintain accurate control over the evolution of channels in the server. Make sure to enable this feature and properly configure the log channel to maintain a comprehensive and detailed record of channel updates in your server.


## Command: channel set

The **/logschannel** command is used to set the channels where events will be sent by the Logs System feature. This command allows you to add a channel if it has not already been set or remove it if it has already been configured. Its utility is fundamental to ensure that events generated by the log system are sent to the correct channel for recording and viewing by Discord server administrators. Make sure to use this command correctly to configure the desired channels for log management in your server. The feature must be enabled with the **/features** command.

- [PERMISSION HASH](/docs/permissions): **logschannel**



## Premium Limitations

This feature does not have any premium limitations.