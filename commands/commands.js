import { LOGO, randomString } from "../utils/commons";
import { handleError } from "../utils/errorHandling";

export const COMMAND_PREFIX = "!";
export const FPL_COMMAND_PREFIX = COMMAND_PREFIX + "fplanguage";
export const subcommands = new Map();
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
sources.set("copy", (name, message) => {
    java.awt.Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new java.awt.datatransfer.StringSelection(message.removeFormatting().replaceAll("\"", "")), null);
});

export function registerSubcommand(subcommandName, callback) {
    subcommands.set(subcommandName, callback);
}

export function approachHandleCommandMessage(name, message, source) {
    if (message.startsWith(COMMAND_PREFIX)) {
        if (message.startsWith(FPL_COMMAND_PREFIX)) handleCommandMessage(name, message, source);
        else handleCommandMessage(name, "!fplanguage toplevel " + message.slice(1), source);
    }
}

export function handleCommandMessage(name, message, source) {
    console.log(`Name: ${name}`);
    console.log(`Message: ${message}`);
    console.log(`Source: ${source}`);
    let sourceCallback = sources.get(source);
    if (!sourceCallback) {
        handleError(`No command source found with name ${source}!`);
        return;
    }
    let commandComponents = message.split(" ").slice(1);
    let subcommand = commandComponents[0];
    if (!subcommand) {
        sourceCallback(name, "§cNo subcommand provided!");
        return;
    }
    let subcommandCallback = subcommands.get(subcommand);
    if (!subcommandCallback) {
        sourceCallback(name, `§cNo subcommand found with name ${subcommand}!`);
        return;
    }
    const args = new Map();
    const rawArgList = commandComponents.splice(1);
    
    for (let i = 0; i < rawArgList.length; i ++) {
        let rawArg = rawArgList[i];
        args.set(i, rawArg);
        let rawArgAsList = rawArg.split(":");
        if (rawArgAsList.length < 2) {
            continue;
        }
        let name = rawArgAsList[0];
        let value = rawArgAsList[1];
        args.set(name, value);
    };
    new Thread(() => subcommandCallback(name, args, sourceCallback)).start();
}

global.hcm = handleCommandMessage;