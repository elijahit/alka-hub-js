# Alka Hub 🌐  

Benvenuto nel repository ufficiale di **Alka Hub**, una applicazione versatile progettata per semplificare la creazione di bot multi-server e white-label su Discord.

### Author: Elijah (Gabriele Mario Tosto)

## 🛠️ Tecnologie Utilizzate  
- **Linguaggio:** JavaScript (node)  
- **Database:** MySQL per la gestione di dati.  
- **API Discord:** Per la gestione dei bot e degli eventi.  

## 📦 Installazione  

### Prerequisiti  
1. Node.js (versione 20.14.0 o superiore)  
2. MySQL installato e configurato con template (alka_bot.sql)
3. Discord Bot Token e permessi adeguati  

### Setup  
1. Clona il repository:  
   ```bash  
   git clone https://github.com/elijahit/alka-hub.git  
   cd alka-hub  

### Avvio
Puoi avviare il worker di sviluppo con il comando **npm run dev**,
altrimenti puoi avviare il worker di produzione con il comando **npm run prod**.

C'è un limite impostato nel worker per contenere il numero massimo di bot concessi che si trova
in */worker/config.js*.


### Licenza

[Alka Hub - WhiteLabel Bot](https://github.com/elijahit/alka-hub-js) by [Gabriele Mario Tosto](https://www.linkedin.com/in/gabriele-tosto) is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1).

[![Creative Commons License](https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1)](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1)
[![BY](https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1)](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1)
[![NC](https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1)](https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1)
