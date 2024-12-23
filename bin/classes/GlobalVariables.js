// Code: GlobalVariables - bin/classes/GlobalVariables.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file GlobalVariables.js
 * @module GlobalVariables
 * @description Contiene le variabili globali
*/

class Variables {
    // Variabili statiche
    static nameConfiguration;
    static botName;
    static botFooter;
    static botFooterIcon;
    static isActive;
    static premium;
    static token;
    static clientId;
    static guildMainId;
    static channelError;
    static presenceStatus;
    static configId;
    static presenceCounter = 0;

    // Getter e Setter per ogni variabile statica
    static getBotName() {
        return this.botName;
    }

    static setBotName(value) {
        this.botName = value;
    }

    static getConfigId() {
        return this.configId;
    }

    static setConfigId(value) {
        this.configId = value;
    }

    static getBotFooter() {
        return this.botFooter;
    }

    static setBotFooterIcon(value) {
        this.botFooterIcon = value;
    }

    static getBotFooterIcon() {
        return this.botFooterIcon;
    }

    static setBotFooter(value) {
        this.botFooter = value;
    }

    static getNameConfiguration() {
        return this.nameConfiguration;
    }

    static setNameConfiguration(value) {
        this.nameConfiguration = value;
    }

    static getIsActive() {
        return this.isActive;
    }

    static setIsActive(value) {
        this.isActive = value;
    }

    static getPremium() {
        return this.premium;
    }

    static setPremium(value) {
        this.premium = value;
    }

    static getToken() {
        return this.token;
    }

    static setToken(value) {
        this.token = value;
    }

    static getClientId() {
        return this.clientId;
    }

    static setClientId(value) {
        this.clientId = value;
    }

    static getGuildMainId() {
        return this.guildMainId;
    }

    static setGuildMainId(value) {
        this.guildMainId = value;
    }

    static getChannelError() {
        return this.channelError;
    }

    static setChannelError(value) {
        this.channelError = value;
    }

    static getPresenceStatus() {
        return this.presenceStatus;
    }

    static setPresenceStatus(value) {
        this.presenceStatus = value;
    }

    static getPresenceCounter() {
        return this.presenceCounter;
    }

    static setPresenceCounter(value) {
        this.presenceCounter = value;
    }
}

module.exports = Variables;