---
sidebar_position: 2
---

# Configuration

This is a general section that contains all the commands and features inherited from multiple features. In the documentation of features where functions are inherited, you will find a link to the main section (*).

*Not always links are present, but it's possible that the commands are inherited. If you find any reference that is not inherited, please indicate the absence of inheritance.*

### Init Command

The **/init** command is used to initialize Alka Hub in your Discord server. This allows insertion into the relational database of Alka Network and configuration of the default language for the bot. After initialization, it will no longer be possible to run /init again, but it will be possible to interact with configurations via /init.

- [PERMISSION HASH](/docs/permissions): **init**

### Features Command

The **/features** command is used to enable or disable the features offered by Alka Network. However, for the command to be used correctly, it is necessary to have previously instantiated the server via /init; otherwise, an error will be returned.

- [PERMISSION HASH](/docs/permissions): **features**

### Help Command

The **/help** command is an essential tool for users of any Discord server. It plays a fundamental role in providing useful information and guiding users through the various available features. This command is accessible to all users, ensuring fair access and greater transparency within the server.
