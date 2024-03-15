const { authProvider } = require('./token') //Rigenera e recupera il token
const { AppTokenAuthProvider  } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { DirectConnectionAdapter, EventSubHttpListener } = require('@twurple/eventsub-http');
const { NgrokAdapter } = require('@twurple/eventsub-ngrok');
const { readFileSync, read } = require('fs')
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params, readDbAll, readDbAllWith1Params } = require('../../bin/database');
const { getEmojifromUrl } = require('../../bin/HandlingFunctions');
const { EmbedBuilder } = require('discord.js');
const language = require('../../languages/languages');
const { client } = require('../../bin/client');

const apiClient = new ApiClient({ authProvider });

const secret = 'O9Q3KKbMPcTgLiZXWPR5LwylJcazv6Ao';
const listener = new EventSubHttpListener({
  apiClient,
  adapter: new NgrokAdapter({
    ngrokConfig: {
      port:8081,
      authtoken: '2de8k4zrwNlMR2RSSXSNsN7TbKe_654GsvZKE7tbbStYkpBpn'
    }
  }),
  secret
});

listener.start();

(async () => {
  await apiClient.eventSub.deleteAllSubscriptions();

  async function run() {
    const databaseTwitch = await readDbAll("twitch_streamers_system");
    for await (const value of databaseTwitch) {
      try {
        await addListener(value);
      } catch (error) {
        console.log(error)
      }
    }
  };
  run();

})();

async function addListener(streamers) {
  listener.onStreamOnline(streamers.streamerId, async e => {
    setInterval(async () => {      
      const notifyTwitch = await readDbAllWith1Params("SELECT * FROM twitch_notify_system WHERE streamerId = ?", streamers.streamerId);
      let counterListner = 0;
      for await (const value of notifyTwitch) {
        counterListner++;
        try {
          const guild = await client.guilds.fetch(value.guildId);
          const checkFeaturesisEnabled = await readDb(`SELECT twitchNotifySystem_enabled from guilds_config WHERE guildId = ?`, guild.id);
          if (!checkFeaturesisEnabled?.twitchNotifySystem_enabled) return;
          let data = await language.databaseCheck(guild.id);
          const langagues_path = readFileSync(`./languages/twitch-system/${data}.json`);
          const language_result = JSON.parse(langagues_path);
          const streams = await e.getStream();
  
          async function getData(data) {
            if (data || typeof data == "number") {
              return data;
            } else {
              return "No data";
            }
          }
          console.log(e)
          let fields = [
            { name: " ", value: `**[${await getData(streams?.title)}](https://twitch.tv/${await getData(streams?.userName)})**` },
            { name: language_result.twitchEmbed.game, value: `${await getData(streams?.gameName)}`, inline: true },
            { name: language_result.twitchEmbed.viewers, value: `${await getData(streams?.viewers)}`, inline: true },
  
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
          console.log(error)
        }
      }
      if (!counterListner) {
        await runDb('DELETE FROM twitch_streamers_system WHERE streamerId = ?', streamers.streamerId);
      }
    }, 60000);
  });
}

module.exports = { addListener, apiClient };