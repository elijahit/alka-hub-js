const youtubeServer = require('fastify')({ logger: false });
const { XMLParser } = require('fast-xml-parser');
const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
const { google } = require('googleapis');
const { readDbAll, readDbAllWith1Params } = require('../../bin/database');
const { getEmojifromUrl } = require('../../bin/HandlingFunctions');
const { client } = require('../../bin/client');
const { EmbedBuilder } = require('discord.js');
const language = require('../../languages/languages');
const { readFileSync } = require('fs');

const youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyDM3xqqqkCuBJH6Czxlt_dfl9ttJM-IlhI"
});


youtubeServer.addContentTypeParser('application/atom+xml', { parseAs: 'string' }, function (req, xmlString, done) {
  try {
    const parser = new XMLParser();
    const body = parser.parse(xmlString, {
      attributeNamePrefix: '',
      ignoreAttributes: false
    })
    done(null, body)
  } catch (error) {
    done(error)
  }
})


youtubeServer.get('/youtubeListener', (request, reply) => {
  reply.send(request.query['hub.challenge'])
})


youtubeServer.post('/youtubeListener', async (request, reply) => {
  if (request.body?.feed?.title) {

    const videoId = request.body.feed.entry['yt:videoId'];
    await postResponse(videoId);
    
  }
  reply.code(204)
  reply.send('ok')

})

async function postResponse (videoId = "string") {
  const apiVideoResult = await youtube.videos.list({
    part: "snippet",
    id: videoId
  });
  const videoResult = Object.freeze({
    videoId: apiVideoResult.data.items[0].id,
    videoUrl: `https://www.youtube.com/watch?v=${apiVideoResult.data.items[0].id}`,
    channelName: apiVideoResult.data.items[0].snippet.channelTitle,
    title: apiVideoResult.data.items[0].snippet.title,
    channelId: apiVideoResult.data.items[0].snippet.channelId,
    channelUrl: `https://www.youtube.com/channel/${apiVideoResult.data.items[0].snippet.channelId}`,
    thumbnail: apiVideoResult.data.items[0].snippet.thumbnails.standard.url,
    description: apiVideoResult.data.items[0].snippet.localized.description,
  })

  const apiChannelResult = await youtube.channels.list({
    part: "snippet",
    id: videoResult.channelId
  });

  const channelResult = Object.freeze({
    thumbnail: apiChannelResult.data.items[0].snippet.thumbnails.default.url,
  })

  const youtubeNotify = await readDbAllWith1Params("SELECT * FROM youtube_notify_system WHERE youtuberId = ?", videoResult.channelId);


  for await (const value of youtubeNotify) {
    // VERIFICO LA LINGUA
    const guild = await client.guilds.fetch(value.guildId);
    let data = await language.databaseCheck(guild.id);
    const langagues_path = readFileSync(`./languages/youtube-system/${data}.json`);
    const language_result = JSON.parse(langagues_path);

    let videoDescription = "";
    if (videoResult.description.length > 400) {
      videoDescription = `${videoResult.description.slice(0, 400)}...`;
    } else if (videoResult.description.length == 0) {
      videoDescription = language_result.youtubeEmbed.embed_description_empty;
    } else {
      videoDescription = videoResult.description;
    }

    let fields = [
      { name: " ", value: `**[${videoResult.title}](${videoResult.videoUrl})**` },
      { name: language_result.youtubeEmbed.embed_description, value: `${videoDescription}` }
    ];

    let customEmoji = await getEmojifromUrl(client, "youtube");
    const embedLog = new EmbedBuilder()
      .setAuthor({ name: `${language_result.youtubeEmbed.embed_title}`, iconURL: customEmoji })
      .setDescription(language_result.youtubeEmbed.description.replace("{0}", videoResult.channelName))
      .setFooter({ text: `${language_result.youtubeEmbed.embed_footer}`, iconURL: `${language_result.youtubeEmbed.embed_icon_url}` })
      .setFields(fields)
      .setImage(videoResult.thumbnail)
      .setThumbnail(channelResult.thumbnail)
      .setColor(0x7d1a13);
    const channel = await guild.channels.fetch(value.channelId);
    if (value.roleMention) {
      const role = await guild.roles.fetch(value.roleMention);
      await channel.send({ content: `${role}`, embeds: [embedLog] });
    } else {
      await channel.send({ embeds: [embedLog] });
    }
  }
}

async function youtubeListener(channelId = "string") {
  youtubeServer.listen({ port: 8080 }, () => {
    const params = new URLSearchParams()
    params.append('hub.callback', 'https://multiversus.eu')
    params.append('hub.mode', 'subscribe')
    params.append('hub.topic', `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`)
    params.append('hub.lease_seconds', '')
    params.append('hub.secret', '')
    params.append('hub.verify', 'sync')
    params.append('hub.verify_token', '')

    return fetch('https://pubsubhubbub.appspot.com/subscribe', {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: params,
      method: 'POST'
    })
  });
}

// ADD FUNCTION
(async function () {
  const databaseYoutube = await readDbAll("youtube_channels_system");
  for await (const value of databaseYoutube) {
    await youtubeListener(value.channelId);
  }
})();

module.exports = {
  youtubeListener,
  youtube,
}