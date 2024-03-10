const { Api, Eve, Chat, ChatEvents, Events } = require("twitch-js");
const { readDb, runDb, readDbAllWith2Params, readDbWith4Params, readDbWith3Params, readDbAll } = require('../../bin/database');
const { readFileSync, read } = require('fs')
const language = require('../../languages/languages');
const { client } = require("../../app");
const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { getEmojifromUrl, errorSendControls } = require("../../bin/HandlingFunctions");


const clientid = "gp762nuuoqcoxypju8c569th9wz7q5";
const token = "ujex4t80g4ywoimzp5eg7u9kmq3oo4";
const api = new Api({ token: token, clientId: clientid, })
const run = async () => {
  const databaseTwitch = await readDbAll("twitch_notify_system");
  for await (const value of databaseTwitch) {
    try {
      const checkStream = await api.get('streams', { search: { user_id: `${value.streamerId}` } })

      if (checkStream.data.length > 0) {
        if (value.sendMessage == null) {
          const streams = checkStream.data[0];
          await runDb("UPDATE twitch_notify_system SET sendMessage = ? WHERE ID = ?", 1, value.ID);
          const guild = await client.guilds.fetch(value.guildId);
          const channel = await guild.channels.fetch(value.channelId);

          let data = await language.databaseCheck(guild.id);
          const langagues_path = readFileSync(`./languages/twitch-system/${data}.json`);
          const language_result = JSON.parse(langagues_path);
          let streamsTags = streams.tags.toString().replaceAll(",", ", ");

          let fields = [
            { name: " ", value: `**[${streams.title}](https://twitch.tv/${streams.userLogin})**` },
            { name: language_result.twitchEmbed.tags, value: `${streamsTags}` },
            { name: language_result.twitchEmbed.game, value: `${streams.gameName}`, inline: true },
            { name: language_result.twitchEmbed.viewers, value: `${streams.viewerCount}`, inline: true },

          ];
          let customEmoji = await getEmojifromUrl(client, "twitch");
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: `${language_result.twitchEmbed.embed_title}`, iconURL: customEmoji })
            .setDescription(language_result.twitchEmbed.description.replace("{0}", streams.userName))
            .setFooter({ text: `${language_result.twitchEmbed.embed_footer}`, iconURL: `${language_result.twitchEmbed.embed_icon_url}` })
            .setFields(fields)
            .setImage(streams.thumbnailUrl.replace("{width}", "400").replace("{height}", "225"))
            .setColor(0x6e0b8c);
          if (value.roleMention) {
            const role = await guild.roles.fetch(value.roleMention);
            await channel.send({ content: `${role}`, embeds: [embedLog] });
          } else {
            await channel.send({ embeds: [embedLog] });
          }
        }
      } else {
        await runDb("UPDATE twitch_notify_system SET sendMessage = ? WHERE ID = ?", null, value.ID);
      }
    }
    catch {
      try {
        const guild = await client.guilds.fetch(value.guildId);
        errorSendControls(error, client, guild, "\\twitch-system\\twitch.js");
      }
      catch {
        await runDb("DELETE FROM twitch_notify_system WHERE guildId = ?", value.guildId);
      }
    }
  }
};

setInterval(async () => {
  await run();
}, 120000);

module.exports = { api };