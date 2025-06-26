import { messageStore } from "../collector";
import { randomElement } from "../commons";
import { registerReactor } from "./reactors";

export default averageCharacterReactor = {
    react() {
        let chosenCharacters = [];
        for (let i = 0; i < this.getAverageCharacterCount(); i ++) {
            let thatCharacterOfEveryMessage = this.getMessages().map((message) => message[i]);
            let addition = randomElement(thatCharacterOfEveryMessage);
            if (addition) chosenCharacters.push(addition);
        }
        let finalMessage = chosenCharacters.join("");
        return `"${finalMessage}"`;
    },

    getMessages() {
        return messageStore.messages.map((message) => message.message);
    },

    getMessageCount() {
        return this.getMessages().length;
    },

    getTotalCharacterCount() {
        return this.getMessages().map((message) => message.length).reduce((a, b) => a + b);
    },

    getAverageCharacterCount() {
        return this.getTotalCharacterCount() / this.getMessageCount();
    }
}

registerReactor("character", averageCharacterReactor);