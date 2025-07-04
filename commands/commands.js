import { LOGO, randomString } from "../utils/commons";
import { handleError } from "../utils/errorHandling";

export const COMMAND_PREFIX = "!fplanguage";
const subcommands = new Map();
const sources = new Map();

sources.set("ct_command", (name, message) => {
    ChatLib.chat(`${LOGO} §r${message}`);
});
sources.set("guild_chat", (name, message) => {
    setTimeout(() => {
        ChatLib.say(`/gc ${message.removeFormatting()} @${randomString(8)}`);
    }, 500);
})
sources.set("bridge_bot", sources.get("guild_chat"));
sources.set("private_message", (name, message) => {
    setTimeout(() => {
        ChatLib.say(`/w ${name} ${message.removeFormatting()} @${randomString(8)}`);
    }, 500);
});

export function registerSubcommand(subcommandName, callback) {
    subcommands.set(subcommandName, callback);
}

export function handleCommandMessage(name, message, source) {
    let sourceCallback = sources.get(source);
    if (!sourceCallback) {
        handleError(`No command source found with name ${source}!`);
        return;
    }
    let commandComponents = message.split(" ");
    let subcommand = commandComponents[0];
    if (!subcommand) {
        sourceCallback(name, "§cNo subcommand provided! Use help for help.");
        return;
    }
    let subcommandCallback = subcommands.get(subcommand);
    if (!subcommandCallback) {
        sourceCallback(name, `§cNo subcommand found with name ${subcommand}!`);
        return;
    }
    new Thread(() => subcommandCallback(name, commandComponents.slice(1), sourceCallback)).start();
}