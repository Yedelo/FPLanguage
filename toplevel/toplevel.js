import { registerSubcommand } from "../commands/commands";

const toplevelHandlers = [];

export function registerToplevelHandler(toplevelHandler) {
    toplevelHandlers.push(toplevelHandler)
}

// handles the command name so you don't have to do it yourself
export function registerToplevelCommand(commandName, toplevelHandler) {
    toplevelHandlers.push((name, args, sourceCallback) => {
        const commandArg = args.get(0);
        if (commandArg != commandName) return;
        toplevelHandler(name, args, sourceCallback);
    });
}

registerSubcommand("toplevel", (name, args, sourceCallback) => {
    toplevelHandlers.forEach((toplevelHandler) => {
        toplevelHandler(name, args, sourceCallback);
    });
});