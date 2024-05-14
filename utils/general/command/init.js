const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const language = require('../../../languages/languages');
const { readFileSync, read } = require('fs');
const { readDb, runDb } = require('../../../bin/database');
const { errorSendControls, getEmojifromUrl, returnPermission, noInitGuilds, noHavePermission } = require('../../../bin/HandlingFunctions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init')
		.setDescription('Use this command to initialize the bot on your server')
		.addStringOption(option =>
			option
				.addChoices({
					name: "English",
					value: "EN",
				})
				.addChoices({
					name: "Italiano",
					value: "IT",
				})
				.setName('languages')
				.setDescription('Please specify the language you wish to use')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("timezone")
				.setDescription('Enter the timezone of your country, check the documentation.')
				.setRequired(true)
		),
	async execute(interaction) {
		let choices, nameChoices, timeChoices;
		// RECUPERO LE OPZIONI INSERITE
		await interaction.options._hoistedOptions.forEach(value => {
			if (value.name == 'languages') {
				choices = value.value;
				nameChoices = value.name;
			}
			if (value.name == 'timezone') {
				timeChoices = value.value;
			}
		});

		// RECUPERO LA LINGUA
		let data = await language.databaseCheck(interaction.guild.id);
		const langagues_path = readFileSync(`./languages/general/${data}.json`);
		const language_result = JSON.parse(langagues_path);
		// CONTROLLA SE L'UTENTE HA IL PERMESSO PER QUESTO COMANDO
		await returnPermission(interaction, "init", async result => {
			try {
				if (result) {
					//CONTROLLO SE IL SERVER E' GIA' INIZIALIZZATO
					const checkInitSql = `SELECT * FROM guilds_config WHERE guildId = ?`
					const checkInit = await readDb(checkInitSql, interaction.guild.id);
					if (!checkInit) {
						let array = [
							"AD|Europe/Andorra",
							"AE|Asia/Dubai",
							"AF|Asia/Kabul",
							"AG|America/Puerto_Rico America/Antigua",
							"AI|America/Puerto_Rico America/Anguilla",
							"AL|Europe/Tirane",
							"AM|Asia/Yerevan",
							"AO|Africa/Lagos Africa/Luanda",
							"AQ|Antarctica/Casey Antarctica/Davis Antarctica/Mawson Antarctica/Palmer Antarctica/Rothera Antarctica/Troll Antarctica/Vostok Pacific/Auckland Pacific/Port_Moresby Asia/Riyadh Antarctica/McMurdo Antarctica/DumontDUrville Antarctica/Syowa",
							"AR|America/Argentina/Buenos_Aires America/Argentina/Cordoba America/Argentina/Salta America/Argentina/Jujuy America/Argentina/Tucuman America/Argentina/Catamarca America/Argentina/La_Rioja America/Argentina/San_Juan America/Argentina/Mendoza America/Argentina/San_Luis America/Argentina/Rio_Gallegos America/Argentina/Ushuaia",
							"AS|Pacific/Pago_Pago",
							"AT|Europe/Vienna",
							"AU|Australia/Lord_Howe Antarctica/Macquarie Australia/Hobart Australia/Melbourne Australia/Sydney Australia/Broken_Hill Australia/Brisbane Australia/Lindeman Australia/Adelaide Australia/Darwin Australia/Perth Australia/Eucla",
							"AW|America/Puerto_Rico America/Aruba",
							"AX|Europe/Helsinki Europe/Mariehamn",
							"AZ|Asia/Baku",
							"BA|Europe/Belgrade Europe/Sarajevo",
							"BB|America/Barbados",
							"BD|Asia/Dhaka",
							"BE|Europe/Brussels",
							"BF|Africa/Abidjan Africa/Ouagadougou",
							"BG|Europe/Sofia",
							"BH|Asia/Qatar Asia/Bahrain",
							"BI|Africa/Maputo Africa/Bujumbura",
							"BJ|Africa/Lagos Africa/Porto-Novo",
							"BL|America/Puerto_Rico America/St_Barthelemy",
							"BM|Atlantic/Bermuda",
							"BN|Asia/Kuching Asia/Brunei",
							"BO|America/La_Paz",
							"BQ|America/Puerto_Rico America/Kralendijk",
							"BR|America/Noronha America/Belem America/Fortaleza America/Recife America/Araguaina America/Maceio America/Bahia America/Sao_Paulo America/Campo_Grande America/Cuiaba America/Santarem America/Porto_Velho America/Boa_Vista America/Manaus America/Eirunepe America/Rio_Branco",
							"BS|America/Toronto America/Nassau",
							"BT|Asia/Thimphu",
							"BW|Africa/Maputo Africa/Gaborone",
							"BY|Europe/Minsk",
							"BZ|America/Belize",
							"CA|America/St_Johns America/Halifax America/Glace_Bay America/Moncton America/Goose_Bay America/Toronto America/Iqaluit America/Winnipeg America/Resolute America/Rankin_Inlet America/Regina America/Swift_Current America/Edmonton America/Cambridge_Bay America/Inuvik America/Dawson_Creek America/Fort_Nelson America/Whitehorse America/Dawson America/Vancouver America/Panama America/Puerto_Rico America/Phoenix America/Blanc-Sablon America/Atikokan America/Creston",
							"CC|Asia/Yangon Indian/Cocos",
							"CD|Africa/Maputo Africa/Lagos Africa/Kinshasa Africa/Lubumbashi",
							"CF|Africa/Lagos Africa/Bangui",
							"CG|Africa/Lagos Africa/Brazzaville",
							"CH|Europe/Zurich",
							"CI|Africa/Abidjan",
							"CK|Pacific/Rarotonga",
							"CL|America/Santiago America/Punta_Arenas Pacific/Easter",
							"CM|Africa/Lagos Africa/Douala",
							"CN|Asia/Shanghai Asia/Urumqi",
							"CO|America/Bogota",
							"CR|America/Costa_Rica",
							"CU|America/Havana",
							"CV|Atlantic/Cape_Verde",
							"CW|America/Puerto_Rico America/Curacao",
							"CX|Asia/Bangkok Indian/Christmas",
							"CY|Asia/Nicosia Asia/Famagusta",
							"CZ|Europe/Prague",
							"DE|Europe/Zurich Europe/Berlin Europe/Busingen",
							"DJ|Africa/Nairobi Africa/Djibouti",
							"DK|Europe/Berlin Europe/Copenhagen",
							"DM|America/Puerto_Rico America/Dominica",
							"DO|America/Santo_Domingo",
							"DZ|Africa/Algiers",
							"EC|America/Guayaquil Pacific/Galapagos",
							"EE|Europe/Tallinn",
							"EG|Africa/Cairo",
							"EH|Africa/El_Aaiun",
							"ER|Africa/Nairobi Africa/Asmara",
							"ES|Europe/Madrid Africa/Ceuta Atlantic/Canary",
							"ET|Africa/Nairobi Africa/Addis_Ababa",
							"FI|Europe/Helsinki",
							"FJ|Pacific/Fiji",
							"FK|Atlantic/Stanley",
							"FM|Pacific/Kosrae Pacific/Port_Moresby Pacific/Guadalcanal Pacific/Chuuk Pacific/Pohnpei",
							"FO|Atlantic/Faroe",
							"FR|Europe/Paris",
							"GA|Africa/Lagos Africa/Libreville",
							"GB|Europe/London",
							"GD|America/Puerto_Rico America/Grenada",
							"GE|Asia/Tbilisi",
							"GF|America/Cayenne",
							"GG|Europe/London Europe/Guernsey",
							"GH|Africa/Abidjan Africa/Accra",
							"GI|Europe/Gibraltar",
							"GL|America/Nuuk America/Danmarkshavn America/Scoresbysund America/Thule",
							"GM|Africa/Abidjan Africa/Banjul",
							"GN|Africa/Abidjan Africa/Conakry",
							"GP|America/Puerto_Rico America/Guadeloupe",
							"GQ|Africa/Lagos Africa/Malabo",
							"GR|Europe/Athens",
							"GS|Atlantic/South_Georgia",
							"GT|America/Guatemala",
							"GU|Pacific/Guam",
							"GW|Africa/Bissau",
							"GY|America/Guyana",
							"HK|Asia/Hong_Kong",
							"HN|America/Tegucigalpa",
							"HR|Europe/Belgrade Europe/Zagreb",
							"HT|America/Port-au-Prince",
							"HU|Europe/Budapest",
							"ID|Asia/Jakarta Asia/Pontianak Asia/Makassar Asia/Jayapura",
							"IE|Europe/Dublin",
							"IL|Asia/Jerusalem",
							"IM|Europe/London Europe/Isle_of_Man",
							"IN|Asia/Kolkata",
							"IO|Indian/Chagos",
							"IQ|Asia/Baghdad",
							"IR|Asia/Tehran",
							"IS|Africa/Abidjan Atlantic/Reykjavik",
							"IT|Europe/Rome",
							"JE|Europe/London Europe/Jersey",
							"JM|America/Jamaica",
							"JO|Asia/Amman",
							"JP|Asia/Tokyo",
							"KE|Africa/Nairobi",
							"KG|Asia/Bishkek",
							"KH|Asia/Bangkok Asia/Phnom_Penh",
							"KI|Pacific/Tarawa Pacific/Kanton Pacific/Kiritimati",
							"KM|Africa/Nairobi Indian/Comoro",
							"KN|America/Puerto_Rico America/St_Kitts",
							"KP|Asia/Pyongyang",
							"KR|Asia/Seoul",
							"KW|Asia/Riyadh Asia/Kuwait",
							"KY|America/Panama America/Cayman",
							"KZ|Asia/Almaty Asia/Qyzylorda Asia/Qostanay Asia/Aqtobe Asia/Aqtau Asia/Atyrau Asia/Oral",
							"LA|Asia/Bangkok Asia/Vientiane",
							"LB|Asia/Beirut",
							"LC|America/Puerto_Rico America/St_Lucia",
							"LI|Europe/Zurich Europe/Vaduz",
							"LK|Asia/Colombo",
							"LR|Africa/Monrovia",
							"LS|Africa/Johannesburg Africa/Maseru",
							"LT|Europe/Vilnius",
							"LU|Europe/Brussels Europe/Luxembourg",
							"LV|Europe/Riga",
							"LY|Africa/Tripoli",
							"MA|Africa/Casablanca",
							"MC|Europe/Paris Europe/Monaco",
							"MD|Europe/Chisinau",
							"ME|Europe/Belgrade Europe/Podgorica",
							"MF|America/Puerto_Rico America/Marigot",
							"MG|Africa/Nairobi Indian/Antananarivo",
							"MH|Pacific/Tarawa Pacific/Kwajalein Pacific/Majuro",
							"MK|Europe/Belgrade Europe/Skopje",
							"ML|Africa/Abidjan Africa/Bamako",
							"MM|Asia/Yangon",
							"MN|Asia/Ulaanbaatar Asia/Hovd Asia/Choibalsan",
							"MO|Asia/Macau",
							"MP|Pacific/Guam Pacific/Saipan",
							"MQ|America/Martinique",
							"MR|Africa/Abidjan Africa/Nouakchott",
							"MS|America/Puerto_Rico America/Montserrat",
							"MT|Europe/Malta",
							"MU|Indian/Mauritius",
							"MV|Indian/Maldives",
							"MW|Africa/Maputo Africa/Blantyre",
							"MX|America/Mexico_City America/Cancun America/Merida America/Monterrey America/Matamoros America/Chihuahua America/Ciudad_Juarez America/Ojinaga America/Mazatlan America/Bahia_Banderas America/Hermosillo America/Tijuana",
							"MY|Asia/Kuching Asia/Singapore Asia/Kuala_Lumpur",
							"MZ|Africa/Maputo",
							"NA|Africa/Windhoek",
							"NC|Pacific/Noumea",
							"NE|Africa/Lagos Africa/Niamey",
							"NF|Pacific/Norfolk",
							"NG|Africa/Lagos",
							"NI|America/Managua",
							"NL|Europe/Brussels Europe/Amsterdam",
							"NO|Europe/Berlin Europe/Oslo",
							"NP|Asia/Kathmandu",
							"NR|Pacific/Nauru",
							"NU|Pacific/Niue",
							"NZ|Pacific/Auckland Pacific/Chatham",
							"OM|Asia/Dubai Asia/Muscat",
							"PA|America/Panama",
							"PE|America/Lima",
							"PF|Pacific/Tahiti Pacific/Marquesas Pacific/Gambier",
							"PG|Pacific/Port_Moresby Pacific/Bougainville",
							"PH|Asia/Manila",
							"PK|Asia/Karachi",
							"PL|Europe/Warsaw",
							"PM|America/Miquelon",
							"PN|Pacific/Pitcairn",
							"PR|America/Puerto_Rico",
							"PS|Asia/Gaza Asia/Hebron",
							"PT|Europe/Lisbon Atlantic/Madeira Atlantic/Azores",
							"PW|Pacific/Palau",
							"PY|America/Asuncion",
							"QA|Asia/Qatar",
							"RE|Asia/Dubai Indian/Reunion",
							"RO|Europe/Bucharest",
							"RS|Europe/Belgrade",
							"RU|Europe/Kaliningrad Europe/Moscow Europe/Simferopol Europe/Kirov Europe/Volgograd Europe/Astrakhan Europe/Saratov Europe/Ulyanovsk Europe/Samara Asia/Yekaterinburg Asia/Omsk Asia/Novosibirsk Asia/Barnaul Asia/Tomsk Asia/Novokuznetsk Asia/Krasnoyarsk Asia/Irkutsk Asia/Chita Asia/Yakutsk Asia/Khandyga Asia/Vladivostok Asia/Ust-Nera Asia/Magadan Asia/Sakhalin Asia/Srednekolymsk Asia/Kamchatka Asia/Anadyr",
							"RW|Africa/Maputo Africa/Kigali",
							"SA|Asia/Riyadh",
							"SB|Pacific/Guadalcanal",
							"SC|Asia/Dubai Indian/Mahe",
							"SD|Africa/Khartoum",
							"SE|Europe/Berlin Europe/Stockholm",
							"SG|Asia/Singapore",
							"SH|Africa/Abidjan Atlantic/St_Helena",
							"SI|Europe/Belgrade Europe/Ljubljana",
							"SJ|Europe/Berlin Arctic/Longyearbyen",
							"SK|Europe/Prague Europe/Bratislava",
							"SL|Africa/Abidjan Africa/Freetown",
							"SM|Europe/Rome Europe/San_Marino",
							"SN|Africa/Abidjan Africa/Dakar",
							"SO|Africa/Nairobi Africa/Mogadishu",
							"SR|America/Paramaribo",
							"SS|Africa/Juba",
							"ST|Africa/Sao_Tome",
							"SV|America/El_Salvador",
							"SX|America/Puerto_Rico America/Lower_Princes",
							"SY|Asia/Damascus",
							"SZ|Africa/Johannesburg Africa/Mbabane",
							"TC|America/Grand_Turk",
							"TD|Africa/Ndjamena",
							"TF|Asia/Dubai Indian/Maldives Indian/Kerguelen",
							"TG|Africa/Abidjan Africa/Lome",
							"TH|Asia/Bangkok",
							"TJ|Asia/Dushanbe",
							"TK|Pacific/Fakaofo",
							"TL|Asia/Dili",
							"TM|Asia/Ashgabat",
							"TN|Africa/Tunis",
							"TO|Pacific/Tongatapu",
							"TR|Europe/Istanbul",
							"TT|America/Puerto_Rico America/Port_of_Spain",
							"TV|Pacific/Tarawa Pacific/Funafuti",
							"TW|Asia/Taipei",
							"TZ|Africa/Nairobi Africa/Dar_es_Salaam",
							"UA|Europe/Simferopol Europe/Kyiv",
							"UG|Africa/Nairobi Africa/Kampala",
							"UM|Pacific/Pago_Pago Pacific/Tarawa Pacific/Midway Pacific/Wake",
							"US|America/New_York America/Detroit America/Kentucky/Louisville America/Kentucky/Monticello America/Indiana/Indianapolis America/Indiana/Vincennes America/Indiana/Winamac America/Indiana/Marengo America/Indiana/Petersburg America/Indiana/Vevay America/Chicago America/Indiana/Tell_City America/Indiana/Knox America/Menominee America/North_Dakota/Center America/North_Dakota/New_Salem America/North_Dakota/Beulah America/Denver America/Boise America/Phoenix America/Los_Angeles America/Anchorage America/Juneau America/Sitka America/Metlakatla America/Yakutat America/Nome America/Adak Pacific/Honolulu",
							"UY|America/Montevideo",
							"UZ|Asia/Samarkand Asia/Tashkent",
							"VA|Europe/Rome Europe/Vatican",
							"VC|America/Puerto_Rico America/St_Vincent",
							"VE|America/Caracas",
							"VG|America/Puerto_Rico America/Tortola",
							"VI|America/Puerto_Rico America/St_Thomas",
							"VN|Asia/Bangkok Asia/Ho_Chi_Minh",
							"VU|Pacific/Efate",
							"WF|Pacific/Tarawa Pacific/Wallis",
							"WS|Pacific/Apia",
							"YE|Asia/Riyadh Asia/Aden",
							"YT|Africa/Nairobi Indian/Mayotte",
							"ZA|Africa/Johannesburg",
							"ZM|Africa/Maputo Africa/Lusaka",
							"ZW|Africa/Maputo Africa/Harare"
						];
						const splitData = array.map(entry => entry.split('|'));
						const resolveData = splitData.filter(value => value[0] == timeChoices || value[1] == timeChoices);

						if(resolveData.length > 0) {
							runInitSql = `INSERT INTO guilds_config (guildId, languages, timeZone) VALUES (?, ?, ?)`
							await runDb(runInitSql, interaction.guild.id, choices, resolveData[0][1]);
							let customEmoji = await getEmojifromUrl(interaction.client, "pexadd");
							const embedLog = new EmbedBuilder()
								.setAuthor({ name: `${language_result.initCommand.embed_title}`, iconURL: customEmoji })
								.setDescription(language_result.initCommand.description_embed)
								.setFooter({ text: `${language_result.initCommand.embed_footer}`, iconURL: `${language_result.initCommand.embed_icon_url}` })
								.setColor(0x4287f5);
							await interaction.reply({ embeds: [embedLog], ephemeral: true });
						}
						else {
							console.log("ERRORE")
						}

					} else {
						let customEmoji = await getEmojifromUrl(interaction.client, "permissiondeny");
						const embedLog = new EmbedBuilder()
							.setAuthor({ name: `${language_result.initCommand.embed_title}`, iconURL: customEmoji })
							.setDescription(language_result.initCommand.description_already_embed)
							.setFooter({ text: `${language_result.initCommand.embed_footer}`, iconURL: `${language_result.initCommand.embed_icon_url}` })
							.setColor(0x4287f5);
						await interaction.reply({ embeds: [embedLog], ephemeral: true });
					}
				}
				else {
					await noHavePermission(interaction, language_result);
				}
			}
			catch (error) {
				errorSendControls(error, interaction.client, interaction.guild, "\\general\\init.js");
			}
		});
	},
};