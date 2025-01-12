
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
   - Modifica i file di configurazione in base alle tue esigenze.  

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

### Cosa è stato aggiornato:
1. **Struttura**: Il file è stato suddiviso in sezioni chiare.
2. **Tecnologie**: Ho elencato le dipendenze principali con brevi descrizioni.
3. **Setup**: Ho aggiunto istruzioni dettagliate per il setup del progetto.
4. **Avvio**: Spiegazioni chiare sulle modalità di sviluppo e produzione.
5. **Link Utili**: Aggiunti per una facile navigazione.