const { REST, Routes } = require('discord.js');
const { token, tokenDev, tokenBeta, clientId, clientIdDev} = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, '../utils');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandsPathResolve = `${commandsPath}//command`;
	const commandFiles = fs.readdirSync(commandsPathResolve).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPathResolve, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] Il comando ${filePath} non contiene una delle due proprietà "data" o "execute".`);
		}
	}
}
// Construct and prepare an instance of the REST module
const filterToken = process.env.NODE_ENV === 'production' ? token : process.env.NODE_ENV === 'development' ? tokenDev : process.env.NODE_ENV === "beta" ? tokenBeta : "";

const rest = new REST().setToken(filterToken);

// and deploy your commands!
(async () => {
	try {
		console.log(`Avvio di ricarica dei comandi (${commands.length}) (/) slashCommands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
      Routes.applicationCommands(process.env.NODE_ENV === 'production' ? clientId : process.env.NODE_ENV === 'development' ? clientIdDev : process.env.NODE_ENV === 'development' ? clientIdBeta : ""),
      { body: commands },
    );

		console.log(`Caricamento di (${data.length}) (/) slashCommands con successo.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();