import { randomElement } from "../utils/commons";
import { registerReactor } from "./reactors";

export default averageWordReactor = {
    react(messages) {
        let chosenWords = [];
        let wordSplitMessages = this.getWordSplitMessages(messages);
        let averageWordCount = this.getAverageWordCount(messages);
        for (let i = 0; i < averageWordCount; i ++) {
            let thatWordOfEveryWordSplitMessage = wordSplitMessages.map((wordSplitMessage) => wordSplitMessage[i]);
            let addition = randomElement(thatWordOfEveryWordSplitMessage);
            if (addition) chosenWords.push(addition);
        }
        let finalMessage = chosenWords.join(" ");
        return `"${finalMessage}"`;
    },

    getMessageCount(messages) {
        return messages.length;
    },

    getWordSplitMessages(messages) {
        return messages.map((message) => message.split(" "));
    },

    getTotalWordCount(messages) {
        return this.getWordSplitMessages(messages).map((wordSplitMessage) => wordSplitMessage.length).reduce((a, b) => a + b)
    },

    getAverageWordCount(messages) {
        return this.getTotalWordCount(messages) / this.getMessageCount(messages);
    },
}

registerReactor("word", averageWordReactor);