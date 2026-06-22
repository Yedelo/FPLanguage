import { messageStore } from "../collector";
import { registerSubcommand } from "../commands/commands";
import { getMatchedArray } from "../utils/arrayMatchers";

let reactors = new Map();
let sentences;

registerSubcommand("react", (name, args, sourceCallback) => {
    const from = args.get("from") || "guild";
    let messages;
    if (from == "guild") {
        messages = messageStore.messages.map((message) => message.message);
    }
    else if (from == "sentences") {
        if (!sentences) {
            sentences = JSON.parse(FileLib.read("FPLanguage", "data/static/sentences.json"));
        }
        messages = sentences.data.map((sentenceData) => sentenceData.sentence);
    }
    else {
        sourceCallback(`§cCouldn't find a message set with name ${from}!`);
        return;
    }
    const reactorName = args.get("reactor") || "word";
    let reactor = reactors.get(reactorName);
    if (!reactor) {
        sourceCallback(`§cCouldn't find a reactor with name ${reactorName}!`);
        return;
    }
    const matcher = args.get("matcher") || "all";
    const matchedMessages = getMatchedArray(matcher, messages);
    if (!matchedMessages || matchedMessages.length == 0) {
        sourceCallback(`§cNo elements found with matcher ${matcher}!`);
        return;
    }
    sourceCallback(reactor.react(matchedMessages));
});

export function registerReactor(name, reactor) {
    reactors.set(name, reactor);
} 
