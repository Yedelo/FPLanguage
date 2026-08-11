import { LOGO, randomString } from "../utils/commons";
import { handleError } from "../utils/errorHandling";

export const COMMAND_PREFIX = "!";
export const FPL_COMMAND_PREFIX = COMMAND_PREFIX + "fplanguage";
export const subcommands = new Map();
const sources = new Map();

sources.set("ct", (response) => {
    ChatLib.chat(`${LOGO} §r${response.message}`);
});
sources.set("guild_chat", (response) => {
    setTimeout(() => {
        let sent = `/gc ${response.message.removeFormatting()}`;
        if (response.extra && response.extra.antiSpam) {
            sent += ` @${randomString(8)}`;
        }
        ChatLib.say(sent);
    }, 500);
})
sources.set("bridge_bot", (response) => {
    sources.get("guild_chat")(response);
});
sources.set("private_message", (response) => {
    setTimeout(() => {
        let sent = `/w ${response.name} ${response.message.removeFormatting()}`;
        if (response.extra && response.extra.antiSpam) {
            sent += ` @${randomString(8)}`;
        }
        ChatLib.say(sent);
    }, 500);
});
sources.set("copy", (response) => {
    java.awt.Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new java.awt.datatransfer.StringSelection(response.message.removeFormatting().replaceAll("\"", "")), null);
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
    const ogSourceCallback = sources.get(source);
    if (!ogSourceCallback) {
        handleError(`No command source found with name ${source}!`);
        return;
    }
    const admin = source == "ct";
    const commandComponents = message.split(" ").slice(1);
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
    const sourceCallback = (msg, extra) => {
        const func = ogSourceCallback;
        const response = {
            name: name,
            message: msg,
            extra: extra
        }
        func(response);
    }
    const subcommand = commandComponents[0];
    if (!subcommand) {
        sourceCallback("§cNo subcommand provided!");
        return;
    }
    const subcommandCallback = subcommands.get(subcommand);
    if (!subcommandCallback) {
        sourceCallback(`§cNo subcommand found with name ${subcommand}!`);
        return;
    }
    const source = {
        name: name,
        args: args,
        respond: sourceCallback,
        admin: admin
    };
    new Thread(() => subcommandCallback(source)).start();
}

export function internal(message) {
    sources.get("ct")(Player.getName(), message);
}

global.hcm = handleCommandMessage;