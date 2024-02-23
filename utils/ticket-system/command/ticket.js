const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync } = require('fs');
const { readDbAllWith2Params, readDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Use this command to set or remove ticket access channels')
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('The channel where the ticket will be initialized')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText)
		)
		.addChannelOption(option =>
			option
				.setName('category')
				.setDescription('The category where the tickets will be opened')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildCategory)
		)
		.addStringOption(option =>
			option
				.setName('description')
				.setDescription('The description that the embed message should contain')
				.setRequired(true)
		),
	async execute(interaction) {
		let channel, description, category;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'channel') channel = value.channel;
			if (value.name == 'description') description = value.value;
			if (value.name == 'category') category = value.channel;
 		});
		console.log(channel, description)

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/ticket-system/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "ticket", async result => {
			try {
				if (result) {
					// SE IL CANALE DEVE ESSERE AGGIUNTO
					
				}
				else {
					let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
					const embedLog = new EmbedBuilder()
						.setAuthor({ name: `${language_result.noPermission.embed_title}`, iconURL: customEmoji })
						.setDescription(language_result.noPermission.description_embed)
						.setFooter({ text: `${language_result.noPermission.embed_footer}`, iconURL: `${language_result.noPermission.embed_icon_url}` })
						.setColor(0x4287f5);
					await interaction.reply({ embeds: [embedLog], ephemeral: true });
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\ticket-system\\ticket.js");
			}
		});
	},
};