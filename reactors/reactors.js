import { messageStore } from "../collector";
import { registerSubcommand } from "../commands/commands";
import { getMatchedArray, MATCHER_PREFIX } from "../utils/arrayMatchers";

let reactors = new Map();

registerSubcommand("react", (name, args, sourceCallback) => {
    let reactorName = args[0];
    if (!reactorName) {
        sourceCallback(name, `§cNo reactor name provided!`);
        return;
    }
    let reactor = reactors.get(reactorName);
    if (!reactor) {
        sourceCallback(name, `§cCouldn't find a reactor with name ${reactorName}!`);
        return;
    }
    let matcher = args[1]?.startsWith(MATCHER_PREFIX) ? args[1].substring(MATCHER_PREFIX.length) : "all";
    let messages = getMatchedArray(matcher, messageStore.messages.map((message) => message.message));
    if (!messages || messages.length == 0) {
        sourceCallback(name, `§cNo elements found with matcher ${matcher}!`);
        return;
    }
    sourceCallback(name, reactor.react(messages));
});

export function registerReactor(name, reactor) {
    reactors.set(name, reactor);
} 
