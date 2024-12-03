class Variables {
    // Variabili statiche
    static name;
    static isActive;
    static premium;
    static token;
    static clientId;
    static guildMainId;
    static channelError;
    static presenceStatus;
    static presenceCounter = 0;

    // Getter e Setter per ogni variabile statica
    static getName() {
        return this.name;
    }

    static setName(value) {
        this.name = value;
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