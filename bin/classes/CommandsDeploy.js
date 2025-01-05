// Code: bin/classes/CommandsDeploy.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2025/26
/**
 * @file CommandsDeploy.js
 * @module CommandsDeploy
 * @description Questa classe si occupa di gestire il deploy dei comandi nel server
*/

const { updateConfig, findAllCommandsByFeatureId } = require('../service/DatabaseService');
const LogClasses = require('./LogClasses');

class CommandsDeploy {
  constructor() {

  }


  /**
   * @description Deploy the commands in the server
   * @param {Object} config
   * @param {string} guildId
   * @param {int} featureId
   * @param {boolean} remove
   * @returns {Promise<void>}
   * @memberof CommandsDeploy
   * @example
   * CommandsDeploy.deploy(config, guildId, featureId, remove);
   */
  async deploy(config, guildId = null, featureId = 0, remove = false) {
    const { REST, Routes } = require('discord.js');
    const fs = require('node:fs');
    const path = require('node:path');
    console.log('Deploying... commands');
    const foldersPath = path.join(__dirname, '../../utils');
    const tokenBot = config.getToken();
    const clientIdBot = config.getClientId();
    const commandsUpdate = [];
    const commandsCreate = [];
    const rest = new REST().setToken(tokenBot);

    let fileDb = await findAllCommandsByFeatureId(featureId);
    if (fileDb == null) throw new Error(`Nessun comando trovato con questo feature_id: ${featureId}`);
    
    console.log(`Deploying... commands for feature_id: ${featureId}/${guildId}  -  Remove: ${remove}`);
    for (const file of fileDb) {
      const commandsPath = path.join(foldersPath, file.feature_folder);
      const commandsPathResolve = `${commandsPath}//command`;
      const filePath = path.join(commandsPathResolve, file.name + '.js');
      if (fs.existsSync(filePath) == false) continue;
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        console.log(`Processing... ${file.name}`);
        if (guildId == null && featureId == 0 && config.getCommandDeploy() == 0 ||  guildId == null && featureId == 0 && file.next_update == 1) {
          console.log(`Next update for ${file.name} is ${file.next_update}`);
          const checkCommand = await rest.get(
            Routes.applicationCommands(clientIdBot)
          )
          if (checkCommand.find(c => c.name === command.data.name)) {
            command.data.id = checkCommand.find(c => c.name === command.data.name).id;
            commandsUpdate.push(command.data.toJSON());
          } else {
            commandsCreate.push(command.data.toJSON());
          }
        } else if (remove == true && guildId != null) {
          console.log(`Removing... ${file.name}`);
          try {
            const checkCommand = await rest.get(
              Routes.applicationGuildCommands(clientIdBot, guildId)
            )
            if (checkCommand.find(c => c.name === command.data.name)) {
              await rest.delete(Routes.applicationGuildCommand(clientIdBot, guildId, checkCommand.find(c => c.name === command.data.name).id));
            }
          } catch (error) {
            console.error(error);
            LogClasses.createLog(guildId, 'ERRORE-DEPLOY-COMMANDS', `Errore durante l'eliminazione del comando ${file.feature_folder}/${file.name}`, config);
            return;
          }
        } else if ((file.feature_id == featureId && featureId != 0) && remove == false && guildId != null) {
          console.log(`Deploying... ${file.name}`);
          try {
            await rest.post(
              Routes.applicationGuildCommands(clientIdBot, guildId),
              { body: command.data.toJSON() }
            );
          } catch (error) {
            console.error(error);
            LogClasses.createLog(guildId, 'ERRORE-DEPLOY-COMMANDS', `Errore durante l'aggiornamento del comando ${file.feature_folder}/${file.name}`, config);
            return;
          }
        }
      } else {
        console.log(`[WARNING] Il comando ${filePath} non contiene una delle due proprietà "data" o "execute".`);
      }
    }

    if (commandsCreate.length > 0) {
      try {
        console.log('Create... commands start');
        for (const command of commandsCreate) {
          await rest.post(
            Routes.applicationCommands(clientIdBot),
            { body: command }
          );
        }
        console.log('Create... commands completed');
      } catch (error) {
        console.error(error);
        LogClasses.createLog("NULL", 'ERRORE-DEPLOY-COMMANDS', `Errore durante l'aggiornamento dei comandi`, config);
        return;
      }
    }

    if (commandsUpdate.length > 0) {
      console.log('Update... commands start');
      try {
        for (const command of commandsUpdate) {
          await rest.patch(
            Routes.applicationCommand(clientIdBot, command.id),
            { body: command }
          );
        }
        console.log('Update... commands completed');
      } catch (error) {
        LogClasses.createLog("NULL", 'ERRORE-DEPLOY-COMMANDS', `Errore durante l'aggiornamento dei comandi`, config);
        console.error(error);
        return;
      }
    }
    console.log('Deploying... commands completed');

    if (config.getCommandDeploy() == 0) {
      config.setCommandDeploy(1);
      await updateConfig({ command_deploy: 1 }, { id: config.getConfigId() });
    }
  }
}
module.exports = CommandsDeploy;