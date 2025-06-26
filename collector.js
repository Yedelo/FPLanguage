import { LocalStore } from "../tska/storage/LocalStore";

const DEFAULT_GUILD_CHAT_REGEX = "Guild > (?:\\[.*\\] )?(.*) \\[.*\\]: (.*)";
const DEFAULT_BRIDGE_MESSAGE_REGEX = "([^ ]*)(?: replying to .*)? » (.*)";

export const regexStore = new LocalStore("FPLanguage", {
    guildChatRegex: DEFAULT_GUILD_CHAT_REGEX,
    bridgeMessageRegex: DEFAULT_BRIDGE_MESSAGE_REGEX,
}, "data/persistent/regexStore.json");

export const messageStore = new LocalStore("FPLanguage", {
    messages: []
}, "data/persistent/messageStore.json");

register("chat", (event) => {
    let chatMessage = ChatLib.getChatMessage(event, true);
    let guildChatRegex;
    try {
        guildChatRegex = new RegExp(regexStore.guildChatRegex);
    }
    catch (e) {
        guildChatRegex = new RegExp(DEFAULT_GUILD_CHAT_REGEX);
        regexStore.guildChatRegex = DEFAULT_GUILD_CHAT_REGEX;
    }
    let guildChatMatch = guildChatRegex.exec(chatMessage);
    if (guildChatMatch) {
        let guildChatName = guildChatMatch[1];
        let guildChatMessage = guildChatMatch[2];
        let bridgeMessageRegex;
        try {
            bridgeMessageRegex = new RegExp(regexStore.bridgeMessageRegex);
        }
        catch (e) {
            bridgeMessageRegex = new RegExp(DEFAULT_BRIDGE_MESSAGE_REGEX);
            regexStore.bridgeMessageRegex = DEFAULT_BRIDGE_MESSAGE_REGEX;
        }
        let bridgeMessageMatch = new RegExp(bridgeMessageRegex).exec(guildChatMessage);
        if (bridgeMessageMatch) {
            executeCollection(bridgeMessageMatch[1], bridgeMessageMatch[2], "bridge");
        }
        else {
            executeCollection(guildChatName, guildChatMessage, "guild");
        }
    }
});

function executeCollection(name, message, source = "unknown") {
    let messageInfo = {
        name: name,
        message: message.removeFormatting(),
        source: source
    };
    messageStore.messages.push(messageInfo);
}