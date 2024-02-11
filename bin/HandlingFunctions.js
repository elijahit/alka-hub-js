const { guildMainId, guildMainChannelsControlsError } = require('../config.json');
const { EmbedBuilder } = require('discord.js');

function errorSendControls (error, client, guild_error, system) {
  client.guilds.fetch(guildMainId)
    .then(guild => {
      guild.channels.fetch(guildMainChannelsControlsError)
      .then(channel => {
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: "Alka Hub | Controls Error ❌" })
          .addFields(
            {name: `Informazioni Guilds`, value: `*Nome Server*\n${guild_error.name}\n*ID Server*\n${guild_error.id}`, inline: true},
            {name: `Owner Guilds | Members`, value: `*Owner ID*\n${guild_error.ownerId}\n*Membri totali*\n${guild_error.memberCount}`, inline: true},
            {name: "Errore riscontrato", value: `${error}`})
          .setDescription(`Abbiamo riscontrato un errore in ${system}`)
          .setColor(0x7a3131)
          .setImage(`https://cdn.discordapp.com/icons/${guild_error.id}/${guild_error.icon}.png`);
        channel.send({embeds: [embedLog]});
      })
    })
}


module.exports = {
  errorSendControls,
}