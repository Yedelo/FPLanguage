import { randomElement } from "../commons";
import { registerReactor } from "./reactors";

export default averageCharacterReactor = {
    react(messages) {
        let chosenCharacters = [];
        for (let i = 0; i < this.getAverageCharacterCount(messages); i ++) {
            let thatCharacterOfEveryMessage = messages.map((message) => message[i]);
            let addition = randomElement(thatCharacterOfEveryMessage);
            if (addition) chosenCharacters.push(addition);
        }
        let finalMessage = chosenCharacters.join("");
        return `"${finalMessage}"`;
    },

    getMessageCount(messages) {
        return messages.length;
    },

    getTotalCharacterCount(messages) {
        return messages.map((message) => message.length).reduce((a, b) => a + b);
    },

    getAverageCharacterCount(messages) {
        return this.getTotalCharacterCount(messages) / this.getMessageCount(messages);
    }
}

registerReactor("character", averageCharacterReactor);