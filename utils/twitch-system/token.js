const { RefreshingAuthProvider } = require('@twurple/auth');
const { readFileSync, writeFileSync } = require('fs');

const clientId = 'ehul2uguodzxhb1jvn4xrf1lzmh94d';
const clientSecret = 'w7bvv8adnu3fhoswjcjct4gohmos94';
const tokenData = JSON.parse(readFileSync('./utils/twitch-system/tokens.json', 'UTF-8'));
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret
	}
);

async function tokenRefresh() {
  authProvider.onRefresh(async (_, newTokenData) => writeFileSync(`./utils/twitch-system/tokens.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'));
  setInterval(async () => {
    await tokenRefresh();
  }, 3600000);
}

tokenRefresh();
authProvider.addUserForToken(tokenData);

const token = tokenData.accessToken;

module.exports = {token, clientId}