
# Alka Hub 🌐  

Benvenuto nel repository ufficiale di **Alka Hub**, una piattaforma scalabile e multi-lingua per la creazione di bot white-label su Discord.

## 📋 Descrizione
**Alka Hub** è progettato per gestire bot multi-server su Discord, offrendo una soluzione personalizzabile per utenti che necessitano di una configurazione flessibile e multi-lingua.

---

## ✍️ Autore  
**Elijah (Gabriele Mario Tosto)**

---

## 🛠️ Tecnologie Utilizzate  

### Linguaggio  
- **JavaScript (Node.js)**  

### Dipendenze Principali  
- **[discord.js](https://discord.js.org/)**: Gestione delle API di Discord.  
- **[sequelize](https://sequelize.org/)**: ORM per la gestione dei database.  
- **[axios](https://axios-http.com/)**: Richieste HTTP asincrone.  
- **[ioredis](https://github.com/luin/ioredis)**: Client Redis per caching avanzato.  
- **[jimp](https://github.com/oliver-moran/jimp)**: Manipolazione di immagini.  
- **[moment-timezone](https://momentjs.com/timezone/)**: Gestione dei fusi orari.  

### Database  
- **MySQL**: Per la gestione dei dati.  

---

## 📦 Installazione  

### Prerequisiti  
1. **Node.js** (v20.14.0 o superiore).  
2. **MySQL** installato e configurato.  
3. **Discord Bot Token** con permessi adeguati.  
4. **PM2** per orchestrare i processi del bot.  

### Setup  
1. Clona il repository:  
   ```bash  
   git clone https://github.com/elijahit/alka-hub-js.git  
   cd alka-hub-js  
   ```
2. Installa le dipendenze:  
   ```bash  
   npm install  
   ```

3. Configura il database MySQL:  
   - Importa il file `alka_bot.sql` per inizializzare la struttura del database.

4. Configura i token e le credenziali:  
   Utilizza la tabella ```configs``` per gestire le tue configurazioni e token:
   - ```name```(TEXT): Inserisci il nome della configurazione, ti aiuterà a visualizzare logs o errori.
   - ```main_discord_id```(TEXT): L'id del discord in cui saranno inviate eventuali comunicazioni con REDIS/Dashboard (-1 invierà la comunicazione a tutti i discord in cui il BOT è presente).
   - ```json```(TEXT): La configrazione in formato JSON effettiva del bot come segue 
   ```json 
   { "botName": "Nome Bot", "botFooter": "Bot Footer", "botFooterIcon": "https://cdn.discordapp.com/app-icons/843183839869665280/6bafa96797abd3b0344721c58d6e5502.png", "token": "TOKEN_HERE", "clientId": "ID_APPLICAZIONE", "presenceStatus": ["PRESENCE 1", "PRESENCE 2", "PRESENCE 3", ...] } ```
   - ```IsActive```(INT): 0 = Non attiva, 1 = Attivo, 2 = Testing (Avviabile con npm run dev).
   - ```server_max```(INT): Il numero di server in cui può essere presente il bot (-1 = illimitato).
   - ```premium```(INT): 0 = Free, 1 = Premium (se impostato a 1 tutte le guild in cui il bot è presente saranno trattate come premium).
   - ```command_deploy```(INT): 0 = Da deployare, 1 = Deployati (Se impostato a 0 al avvio del worker tutti i comandi default saranno registrati).
   

---

## 🚀 Avvio  

### Modalità di Sviluppo  
Avvia il bot in modalità sviluppo:  
```bash
npm run dev
```

### Modalità di Produzione  
Avvia il bot in modalità produzione:  
```bash
npm run prod
```

### Configurazione  
Puoi modificare il limite massimo di bot configurato nel file:  
```bash
/worker/config.js
```

---

## 📄 Licenza  
[Alka Hub - WhiteLabel Bot](https://github.com/elijahit/alka-hub-js) by [Gabriele Mario Tosto](https://www.linkedin.com/in/gabriele-tosto) è rilasciato sotto licenza [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1).  

[![Creative Commons License](https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1)](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1)
[![BY](https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1)](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1)
[![NC](https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1)](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1)

---

## 🐛 Segnalazione Bug  
Per segnalare un problema, utilizza la sezione [Issues](https://github.com/elijahit/alka-hub-js/issues).

---

## 🌐 Link Utili  
- [Repository](https://github.com/elijahit/alka-hub-js)  
- [Homepage](https://github.com/elijahit/alka-hub-js#readme)  

```