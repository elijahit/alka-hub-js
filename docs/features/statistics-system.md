---
sidebar_position: 6
description: The server statistics system offers flexibility and customization, allowing users to tailor their statistics using various channel types. This intuitive approach enhances user interaction and overall community experience.
---

# Statistics System

The server statistics system has been developed with the aim of offering flexibility and customization. Thanks to this solution, you have the opportunity to tailor your statistics completely, leveraging the various available channel types. This approach makes interaction with the server statistics extremely intuitive and accessible to all users, thus contributing to enhancing the overall experience within the community.

Watch the preview of this statistics system on YouTube now.
[Preview](https://www.youtube.com/embed/1t89s9hUmEo)

## Markdown, how to use it?

Markdown is a markup language characterized by a simple textual syntax, often converted into HTML. We have chosen to implement a similar system within Alka Hub, deciding to call it by the same name to make it intuitive and easy to use. The markup language of Alka Hub is delineated by curly braces and includes a numeric identifier that defines the data to be displayed. This approach allows for extensive customization and facilitates interaction with the content within the platform, promoting greater versatility in information presentation.

## Data Types

Data types constitute the information retrievable using the markdown `{n}` and will be classified based on the type of statistics set via commands. This information is essential for enhancing your experience. Each created statistics channel can include emojis to further enrich the data visualization.

### Date [type]

The "Date" channel type is used to display the current date within a voice channel based on the local time configured via the `/init` command. Local time can be specified with positive and negative values relative to UTC and must always include the plus symbol (+), allowing for offset settings even from a UTC time (+0).

**Markdown:**
```
{0}: Day (DD)
{1}: Month (MM)
{2}: Year (YYYY)
Example: {0}/{1}/{2} (Never use backslash (\))
```

### Hour [type]

The "Hour" channel type is used to display the current time within a voice channel based on the local time configured via the `/init` command. Local time can be specified with positive and negative values relative to UTC and must always include the plus symbol (+), allowing for offset settings even from a UTC time (+0).

**Markdown:**
```
{0}: Hours (HH)
{1}: Minutes (MM)
Example: {0}:{1} (Never use backslash (\))
```

### Date / Hour [type]

The "Date / Hour" channel type is used to simultaneously display the current date and time within a voice channel based on the local time configured via the `/init` command. Local time can be specified with positive and negative values relative to UTC and must always include the plus symbol (+), allowing for offset settings even from a UTC time (+0).

**Markdown:**
```
{0}: Day (DD)
{1}: Month (MM)
{2}: Year (YYYY)
{3}: Hours (HH)
{4}: Minutes (MM)
Example: {0}/{1}/{2} | {3}:{4} (Never use backslash (\))
```

### Member Count [type]

The "Member Count" channel type is used to display the total number of members present in the Discord server within a voice channel. This allows users to quickly view the current number of members in the community, providing useful information about the size and activity of the server.

**Markdown:**
```
{0}: Counter (000)
Example: Members: {0} (Never use backslash (\))
```

### Channel Count [type]

The "Channel Count" channel type is used to display, within a voice channel, the total count of channels present in the Discord server. This allows users to get a quick overview of the overall structure and size of the server, providing useful information about the variety and availability of channels for interaction.

**Markdown:**
```
{0}: Counter (000)
Example: Channel: {0} (Never use backslash (\))
```

### Bot Count [type]

The "Bot Count" channel type is used to display, within a voice channel, the total count of bots present in the Discord server. This allows users to get an immediate overview of the number of active bots in the community, providing relevant information about the presence and usage of bots in the server.

**Markdown:**
```
{0}: Counter (000)
Example: Bot: {0} (Never use backslash (\))
```

### Role Count [type]

The "Role Count" channel type is used to display, within a voice channel, the count of members belonging to a specific role in the Discord server. To have the role counted in the statistics system, it must be set in the generated channel with the permission denied for "Read Message History". This allows maintaining the privacy of conversations in the channel while providing information about the number of members associated with specific roles.

**Markdown:**
```
{0}: Counter (000)
Example: Staff: {0} (Never use backslash (\))
```

### Role Online Count [type]

The "Role Count Online" channel type is used to display, within a voice channel, the count of online members belonging to a specific role in the Discord server. To have the role counted in the statistics system, it must be set in the generated channel with the permission denied for "Read Message History". This ensures the privacy of conversations in the channel while providing information about the number of online members associated with specific roles.

**Markdown:**
```
{0}: Counter (000)
Example: Staff: {0} (Never use backslash (\))
```

### Status Bar [type]

The "Status Bar" channel type is used to display, within a voice channel, the status bar showing the count of members online, idle, and in do not disturb mode in the Discord server. This visualization provides a quick overview of the current status of members in the server, allowing users to easily understand the availability and activity of the community.

**Markdown:**
```
{0}: Online (000)
{1}: Do Not Disturb (000)
{2}: Idle (000)
Example: 🟢 {0} 🔴 {1} 🟡 {2} (Never use backslash (\))
```

## Statistics Command

The `/statistics` command is used to generate the category that will contain the voice channels of the statistics system. This category can be renamed as desired, allowing server administrators to customize it according to their preferences or specific needs.

- [PERMISSION HASH](/docs/permissions): **statsServer**

## Channel Stats Command

The `/channelstats` command is used to generate the channels within the statistics system category. The modal that appears will contain pre-compiled information that must remain unchanged; otherwise, an error will be returned. This ensures the consistency and accuracy of information in the statistics system, avoiding accidental changes that could compromise its functionality.

- [PERMISSION HASH](/docs/permissions): **statsServer**

## Channel Stats Edit Command

The `/channelstatsedit` command is used to edit the titles of the channels within the statistics system category. The modal that appears will contain pre-compiled information that must remain unchanged; otherwise, an error will be returned. This ensures the consistency and accuracy of information in the statistics system, avoiding accidental changes that could compromise the system's functionality.

- [PERMISSION HASH](/docs/permissions): **statsServer**

## Markdown Stats Command

The `/markdownstats` command is used to display a help message containing the list of available markdowns to assign to the channels of the statistics system. This provides users with a quick and clear guide on the formatting options available to customize the statistics channels according to their preferences and needs.

- [PERMISSION HASH](/docs/permissions): **statsServer**


## Premium Limitations

Users with a free plan can create a maximum of 2 channels of statistics using the **/channelstats** command.