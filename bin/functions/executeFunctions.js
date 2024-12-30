// Code: executeFolderModule - bin/functions/executeFolderModule.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25

/**
 * @file executeFolderModule.js
 * @module executeFolderModule
 * @description Contiene il metodo {executeFolderModule}
 */

const fs = require('node:fs');
const path = require('node:path');

function executeFolderModule(client, mainDir, variables) {
  const foldersPath = path.join(process.cwd(), mainDir);
  const moduleFolder = fs.readdirSync(foldersPath);

  for (const folder of moduleFolder) {
    const modulePath = path.join(foldersPath, folder);
    const eventsPathResolve = `${modulePath}/events`;
    const commandsPathResolve = `${modulePath}/command`;

    // Caricamento Comandi
    if (fs.existsSync(commandsPathResolve)) {
      const commandFiles = fs.readdirSync(commandsPathResolve).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        try {
          const filePath = path.join(commandsPathResolve, file);
          const command = require(filePath);

          if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, {
              ...command,
              execute: (...args) => command.execute(...args, variables)
            });
          }
        } catch (error) {
          console.error(`[!C] ${file} non caricato`);
          console.error(error);
        }
      }
    }

    // Caricamento Eventi
    if (fs.existsSync(eventsPathResolve)) {
      const eventsFiles = fs.readdirSync(eventsPathResolve).filter(file => file.endsWith('.js'));
      for (const file of eventsFiles) {
        try {
          const filePath = path.join(eventsPathResolve, file);
          const event = require(filePath);
          client.on(event.name, (...args) => event.execute(...args, variables));
        } catch (error) {
          console.error(`[!E] ${file} non caricato`);
          console.error(error);
        }
      }
    }
  }
}

module.exports = executeFolderModule;
