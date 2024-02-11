const { Events, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const language = require('../../../languages/languages');
const database = require('../../../bin/database');

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
  },
}