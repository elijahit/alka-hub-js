const { RefreshingAuthProvider } = require('@twurple/auth');
const { readFileSync, writeFileSync } = require('fs');

const clientId = 'ehul2uguodzxhb1jvn4xrf1lzmh94d';
const clientSecret = 'w7bvv8adnu3fhoswjcjct4gohmos94';
let tokenData = JSON.parse(readFileSync('./utils/twitch-system/tokens.json', 'UTF-8'));
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret
	}
);
authProvider.onRefresh(async (_, newTokenData) => {
  writeFileSync(`./utils/twitch-system/tokens.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8')
  tokenData = JSON.parse(readFileSync('./utils/twitch-system/tokens.json', 'UTF-8'));
});

authProvider.addUserForToken(tokenData);

// QUESTO INTERVALLO CONTROLLA SECONDO DOPO SECONDO IL TOKEN PER AGGIORNARLO QUANDO SCADE
setInterval(async () => {
  let expiresTime = (tokenData.obtainmentTimestamp + (tokenData.expiresIn*1000));
  if(Date.now() >= expiresTime) {
    await authProvider.addUserForToken(tokenData);
  }
}, 1000);

const token = tokenData.accessToken;

module.exports = {token, clientId, clientSecret, authProvider}