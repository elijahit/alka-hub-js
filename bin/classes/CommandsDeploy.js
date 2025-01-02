const { findCommandsByName, updateConfig } = require('../service/DatabaseService');

class CommandsDeploy {
  constructor() {

  }


  async deploy(config) {
    const { REST, Routes } = require('discord.js');
    const fs = require('node:fs');
    const path = require('node:path');
    console.log('Deploying... commands');
    const foldersPath = path.join(__dirname, '../../utils');
    const commandFolders = fs.readdirSync(foldersPath);
    const tokenBot = config.getToken();
    const clientIdBot = config.getClientId();
    const commandsUpdate = [];
    const commandsCreate = [];
    const rest = new REST().setToken(tokenBot);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandsPathResolve = `${commandsPath}//command`;
      const commandFiles = fs.readdirSync(commandsPathResolve).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        let fileDb = await findCommandsByName(file.replace('.js', ''));
        fileDb = fileDb?.get({ plain: true });

        if (fileDb.next_update == 1 || config.getCommandDeploy() == 0) {
          const filePath = path.join(commandsPathResolve, file);
          const command = require(filePath);
          if ('data' in command && 'execute' in command) {
            const checkCommand = await rest.get(
              Routes.applicationCommands(clientIdBot)
            )
            if (checkCommand.find(c => c.name === command.data.name)) {
              commandsUpdate.push(command.data.toJSON());
            } else {
              commandsCreate.push(command.data.toJSON());
            }
          } else {
            console.log(`[WARNING] Il comando ${filePath} non contiene una delle due proprietà "data" o "execute".`);
          }
        }
      }
    }
    if (commandsCreate.length > 0) {
      try{
        for (const command of commandsCreate) {
          await rest.post(
            Routes.applicationCommands(clientIdBot),
            { body: command }
          );
        }
        console.log('Create... commands completed');
      } catch (error) {
        console.error(error);
      }
      return;
    }

    if (commandsUpdate.length > 0) {
      try {
        await rest.patch(
          Routes.applicationCommands(clientIdBot),
          { body: commandsUpdate }
        );
        console.log('Update... commands completed');
      } catch (error) {
        console.error(error);
      }
    }

    if (config.getCommandDeploy() == 0) await updateConfig({ command_deploy: 1 }, { id: config.getConfigId() });
    console.log('Deploying... commands completed');
  }
}
module.exports = CommandsDeploy;