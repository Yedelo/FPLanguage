import { LOGO } from "../commons";
import { handleError } from "../errorHandling";

export const COMMAND_PREFIX = "!"
const subcommands = new Map();
const sources = new Map();

sources.set("ct_command", (message) => {
    ChatLib.chat(`${LOGO} §r${message}`);
});
sources.set("guild_chat", (message) => {
    setTimeout(() => {
        ChatLib.say(`/gc ${message.removeFormatting()}`);
    }, 500);
})
sources.set("bridge_bot", sources.get("guild_chat"));

export function registerSubcommand(subcommandName, callback) {
    subcommands.set(subcommandName, callback);
}

export function handleCommandMessage(message, source) {
    let sourceCallback = sources.get(source);
    if (!sourceCallback) {
        handleError(`No command source found with name ${source}!`);
        return;
    }
    let commandComponents = message.split(" ");
    let subcommand = commandComponents[0];
    if (!subcommand) {
        sourceCallback("§cNo subcommand provided! Use help for help.");
        return;
    }
    let subcommandCallback = subcommands.get(subcommand);
    if (!subcommandCallback) {
        sourceCallback(`§cNo subcommand found with name ${subcommand}!`);
        return;
    }
    subcommandCallback(commandComponents.slice(1), sourceCallback);
}