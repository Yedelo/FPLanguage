import { registerSubcommand } from "../commands/commands";

let reactors = new Map();

registerSubcommand("react", (args, sourceCallback) => {
    let reactorName = args[0];
    if (!reactorName) {
        sourceCallback(`§cNo reactor name provided!`);
    }
    let reactor = reactors.get(reactorName);
    if (!reactor) {
        sourceCallback(`§cCouldn't find a reactor with name ${reactorName}!`);
        return;
    }
    sourceCallback(reactor.react());
});

export function registerReactor(name, reactor) {
    reactors.set(name, reactor);
} 
