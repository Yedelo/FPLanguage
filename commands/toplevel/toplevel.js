import { registerSubcommand } from "../commands";

const toplevelHandlers = [];

export function registerToplevelHandler(toplevelHandler) {
    toplevelHandlers.push(toplevelHandler)
}

// handles the command name so you don't have to do it yourself
export function registerToplevelCommand(commandName, toplevelHandler) {
    toplevelHandlers.push((source) => {
        const commandArg = source.args.get(0);
        if (commandArg != commandName) return;
        toplevelHandler(source);
    });
}

registerSubcommand("toplevel", (source) => {
    toplevelHandlers.forEach((toplevelHandler) => {
        toplevelHandler(source);
    });
});