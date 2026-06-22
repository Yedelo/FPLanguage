import { registerSubcommand } from "../commands/commands";

const toplevelHandlers = [];

export function registerToplevelHandler(toplevelHandler) {
    toplevelHandlers.push(toplevelHandler)
}

registerSubcommand("toplevel", (name, args, sourceCallback) => {
    toplevelHandlers.forEach((toplevelHandler) => {
        toplevelHandler(name, args, sourceCallback);
    });
});