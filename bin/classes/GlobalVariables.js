// Code: GlobalVariables - bin/classes/GlobalVariables.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file GlobalVariables.js
 * @module GlobalVariables
 * @description Contiene le variabili globali
*/

class Variables {
    constructor() {
        this.nameConfiguration = null;
        this.botName = null;
        this.botFooter = null;
        this.botFooterIcon = null;
        this.isActive = null;
        this.premium = null;
        this.token = null;
        this.clientId = null;
        this.presenceStatus = null;
        this.configId = null;
        this.presenceCounter = 0;
        this.commandDeploy = null;
    }

    // Getter e Setter per ogni variabile
    getBotName() {
        return this.botName;
    }

    setBotName(value) {
        this.botName = value;
    }

    getConfigId() {
        return this.configId;
    }

    setConfigId(value) {
        this.configId = value;
    }

    getBotFooter() {
        return this.botFooter;
    }

    setBotFooterIcon(value) {
        this.botFooterIcon = value;
    }

    getBotFooterIcon() {
        return this.botFooterIcon;
    }

    setBotFooter(value) {
        this.botFooter = value;
    }

    getNameConfiguration() {
        return this.nameConfiguration;
    }

    setNameConfiguration(value) {
        this.nameConfiguration = value;
    }

    setCommandDeploy(value) {
        this.commandDeploy = value;
    }

    getCommandDeploy() {
        return this.commandDeploy;
    }

    getIsActive() {
        return this.isActive;
    }

    setIsActive(value) {
        this.isActive = value;
    }

    getPremium() {
        return this.premium;
    }

    setPremium(value) {
        this.premium = value;
    }

    getToken() {
        return this.token;
    }

    setToken(value) {
        this.token = value;
    }

    getClientId() {
        return this.clientId;
    }

    setClientId(value) {
        this.clientId = value;
    }

    getPresenceStatus() {
        return this.presenceStatus;
    }

    setPresenceStatus(value) {
        this.presenceStatus = value;
    }

    getPresenceCounter() {
        return this.presenceCounter;
    }

    setPresenceCounter(value) {
        this.presenceCounter = value;
    }
}

module.exports = Variables;