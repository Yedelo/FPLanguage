import { registerSubcommand } from "../commands/commands";

const toplevelHandlers = [];

export function registerToplevelHandler(toplevelHandler) {
    toplevelHandlers.push(toplevelHandler)
}

registerSubcommand("toplevel", (name, args, sourceCallback) => {
    console.log("Made it to toplevel");
    console.log(`Name: ${name}`);
    console.log(`Args: ${Array.from(args)}`)
    toplevelHandlers.forEach((toplevelHandler) => {
        toplevelHandler(name, args, sourceCallback);
    });
});