import { LocalStore } from "../tska/storage/LocalStore";

const GUILD_CHAT_REGEX = /Guild > (?:\[.*\] )?(.*) \[.*\]: (.*)/;
const BRIDGE_MESSAGE_REGEX = /([^ ]*)(?: replying to .*)? » (.*)/;

export const messageStore = new LocalStore("FPLanguage", {
    messages: []
}, "data/persistent/messageStore.json");

register("chat", (event) => {
    let chatMessage = ChatLib.getChatMessage(event, false).removeFormatting();
    let guildChatMatch = GUILD_CHAT_REGEX.exec(chatMessage);
    if (guildChatMatch) {
        let guildChatName = guildChatMatch[1];
        let guildChatMessage = guildChatMatch[2];
        let bridgeMessageMatch = BRIDGE_MESSAGE_REGEX.exec(guildChatMessage);
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