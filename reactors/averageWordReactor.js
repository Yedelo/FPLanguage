import { messageStore } from "../collector";
import { registerSubcommand } from "../commands/commands";
import { randomElement } from "../commons";
import { registerReactor } from "./reactors";

export default averageWordReactor = {
    react() {
        let chosenWords = [];
        let messages = this.getMessages();
        let wordSplitMessages = this.getWordSplitMessages();
        let averageWordCount = this.getAverageWordCount();
        for (let i = 0; i < averageWordCount; i ++) {
            let thatWordOfEveryWordSplitMessage = wordSplitMessages.map((wordSplitMessage) => wordSplitMessage[i]);
            let addition = randomElement(thatWordOfEveryWordSplitMessage);
            if (addition) chosenWords.push(addition);
        }
        let finalMessage = chosenWords.join(" ");
        return `"${finalMessage}"`;
    },

    getMessages() {
        return messageStore.messages.map((message) => message.message);
    },

    getMessageCount() {
        return this.getMessages().length;
    },

    getWordSplitMessages() {
        return this.getMessages().map((message) => message.split(" "));
    },

    getTotalWordCount() {
        return this.getWordSplitMessages().map((wordSplitMessage) => wordSplitMessage.length).reduce((a, b) => a + b)
    },

    getAverageWordCount() {
        return this.getTotalWordCount() / this.getMessageCount();
    },
}

registerReactor("word", averageWordReactor);