import { messageStore } from "../collector";
import { registerSubcommand } from "../commands/commands";

let reactors = new Map();

registerSubcommand("react", (name, args, sourceCallback) => {
    let reactorName = args[0];
    if (!reactorName) {
        sourceCallback(name, `§cNo reactor name provided!`);
    }
    let reactor = reactors.get(reactorName);
    if (!reactor) {
        sourceCallback(name, `§cCouldn't find a reactor with name ${reactorName}!`);
        return;
    }
    let messages = messageStore.messages.map((message) => message.message);
    sourceCallback(name, reactor.react(messages));
});

export function registerReactor(name, reactor) {
    reactors.set(name, reactor);
} 
