const { token: accessToken, clientId } = require('./token') //Rigenera e recupera il token
const { StaticAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubWsListener } = require('@twurple/eventsub-ws');
const { readFileSync, read } = require('fs')
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params, readDbAll, readDbAllWith1Params } = require('../../bin/database');
const { getEmojifromUrl } = require('../../bin/HandlingFunctions');
const { EmbedBuilder } = require('discord.js');
const language = require('../../languages/languages');
const { client } = require('../../bin/client');


const authProvider = new StaticAuthProvider(clientId, accessToken);
const apiClient = new ApiClient({ authProvider });

const listener = new EventSubWsListener({ apiClient });
listener.start();

async function addListener(streamers) {
  console.log(streamers);
  listener.onStreamOnline(streamers.streamerId, async e => {
    console.log(streamers.streamerId, "è in live")
    const notifyTwitch = await readDbAllWith1Params("SELECT * FROM twitch_notify_system WHERE streamerId = ?", streamers.streamerId);
    console.log(notifyTwitch)
    let counterListner = 0;
    for await (const value of notifyTwitch) {
      counterListner++;
      try {
        const guild = await client.guilds.fetch(value.guildId);
        let data = await language.databaseCheck(guild.id);
        const langagues_path = readFileSync(`./languages/twitch-system/${data}.json`);
        const language_result = JSON.parse(langagues_path);
        const streams = await e.getStream();
    
        async function getData(data) {
          if(data || typeof data == "number") {
            return data;
          } else {
            return "No data";
          }
        }
        let fields = [
          { name: " ", value: `**[${await getData(streams.title)}](https://twitch.tv/${await getData(streams.userName)})**` },
          { name: language_result.twitchEmbed.game, value: `${await getData(streams.gameName)}`, inline: true },
          { name: language_result.twitchEmbed.viewers, value: `${await getData(streams.viewers)}`, inline: true },
    
        ];
        let customEmoji = await getEmojifromUrl(client, "twitch");
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: `${language_result.twitchEmbed.embed_title}`, iconURL: customEmoji })
          .setDescription(language_result.twitchEmbed.description.replace("{0}", await getData(streams.userName)))
          .setFooter({ text: `${language_result.twitchEmbed.embed_footer}`, iconURL: `${language_result.twitchEmbed.embed_icon_url}` })
          .setFields(fields)
          .setThumbnail((await streams.getUser()).profilePictureUrl)
          .setImage(streams.thumbnailUrl.replace("{width}", "400").replace("{height}", "225"))
          .setColor(0x6e0b8c);
        const channel = await guild.channels.fetch(value.channelId);
        if (value.roleMention) {
          const role = await guild.roles.fetch(value.roleMention);
          await channel.send({ content: `${role}`, embeds: [embedLog] });
        } else {
          await channel.send({ embeds: [embedLog] });
        }
      }
      catch (error) {
        const errorCheck = new Error(error);
        if (errorCheck.message == "DiscordAPIError[10004]: Unknown Guild") {
          await runDb('DELETE FROM twitch_notify_system WHERE guildId = ?', value.guildId);
        }
        else if (errorCheck.message == "DiscordAPIError[10003]: Unknown Channel") {
          await runDb('DELETE FROM twitch_notify_system WHERE guildId = ? AND channelId = ?', value.guildId, value.channelId);
        }
      }
    }
    if(!counterListner) {
      await runDb('DELETE FROM twitch_streamers_system WHERE streamerId = ?', streamers.streamerId);
    }
  });
}

async function run() {
  const databaseTwitch = await readDbAll("twitch_streamers_system");
  for await (const value of databaseTwitch) {
    await addListener(value);
  }
}

run();

module.exports = {addListener, apiClient};