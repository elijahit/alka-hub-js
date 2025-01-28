
# Alka Hub 🌐

Welcome to the official repository of **Alka Hub**, a scalable and multi-language platform for creating white-label bots on Discord.

## 📋 Description
**Alka Hub** is designed to manage multi-server bots on Discord, offering a customizable solution for users who need flexible and multi-language configuration.

---

## ✍️ Author
**Elijah (Gabriele Mario Tosto)**

---

## 🛠️ Technologies Used

### Language
- **JavaScript (Node.js)**

### Main Dependencies
- **[discord.js](https://discord.js.org/)**: Management of Discord APIs.
- **[sequelize](https://sequelize.org/)**: ORM for database management.
- **[axios](https://axios-http.com/)**: Asynchronous HTTP requests.
- **[ioredis](https://github.com/luin/ioredis)**: Redis client for advanced caching.
- **[jimp](https://github.com/oliver-moran/jimp)**: Image manipulation.
- **[moment-timezone](https://momentjs.com/timezone/)**: Timezone management.
- **[mysql2](https://www.npmjs.com/package/mysql2)**: MySQL database connection.

### Database
- **MySQL**: For data management.

---

## 📦 Installation

### Prerequisites
1. **Node.js** (v20.14.0 or higher).
2. **MySQL** installed and configured.
3. **Discord Bot Token** with appropriate permissions.
4. **PM2** to orchestrate bot processes.

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/elijahit/alka-hub-js.git
   cd alka-hub-js
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the MySQL database:
   - Import the `alka_bot.sql` file to initialize the database structure.

4. Configure tokens and credentials:
   Use the `configs` table to manage your configurations and tokens:
   - `name`(TEXT): Enter the configuration name, it will help you view logs or errors.
   - `main_discord_id`(TEXT): The Discord ID where communications with REDIS/Dashboard will be sent (-1 will send communication to all Discords where the BOT is present).
   - `json`(TEXT): The actual bot configuration in JSON format as follows:
   ```json
   { "botName": "Bot Name", "botFooter": "Bot Footer", "botFooterIcon": "https://cdn.discordapp.com/app-icons/843183839869665280/6bafa96797abd3b0344721c58d6e5502.png", "token": "TOKEN_HERE", "clientId": "APPLICATION_ID", "presenceStatus": ["PRESENCE 1", "PRESENCE 2", "PRESENCE 3", ...] }
   ```
   - `IsActive`(INT): 0 = Inactive, 1 = Active, 2 = Testing (Startable with npm run dev).
   - `server_max`(INT): The number of servers the bot can be present in (-1 = unlimited).
   - `premium`(INT): 0 = Free, 1 = Premium (if set to 1 all guilds where the bot is present will be treated as premium).
   - `command_deploy`(INT): 0 = To be deployed, 1 = Deployed (If set to 0 at worker startup all default commands will be registered).

---

## 🚀 Launch

### Development Mode
Start the bot in development mode:
```bash
npm run dev
```

### Production Mode
Start the bot in production mode:
```bash
npm run prod
```

### Configuration
You can modify the maximum bot limit configured in the file:
```bash
/worker/config.js
```

---

## 📄 License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](/license) file for details.

[![Apache License](https://www.apache.org/img/asf_logo.png)](http://www.apache.org/licenses/LICENSE-2.0)

---

## 🐛 Bug Reporting
To report an issue, use the [Issues](https://github.com/elijahit/alka-hub-js/issues) section.

---

## 🌐 Useful Links
- [Repository](https://github.com/elijahit/alka-hub-js)
- [Homepage](https://github.com/elijahit/alka-hub-js#readme)

