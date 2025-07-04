import EventListener from "../../tska/event/EventListener";

export const GUILD_CHAT_EVENT_NAME = "fplanguage:guild_chat_event";
const GUILD_CHAT_REGEX = /Guild > (?:\[.*\] )?(.*) \[.*\]: (.*)/;
const BRIDGE_MESSAGE_REGEX = /([^ ]*)(?: replying to .*)? » (.*)/;

EventListener.createEvent(GUILD_CHAT_EVENT_NAME);

register("chat", (event) => {
    let chatMessage = ChatLib.getChatMessage(event, false).removeFormatting();
    let guildChatMatch = GUILD_CHAT_REGEX.exec(chatMessage);
    if (guildChatMatch) {
        let guildChatName = guildChatMatch[1];
        let guildChatMessage = guildChatMatch[2];
        let bridgeMessageMatch = BRIDGE_MESSAGE_REGEX.exec(guildChatMessage);
        if (bridgeMessageMatch) {
            EventListener.post(GUILD_CHAT_EVENT_NAME, bridgeMessageMatch[1], bridgeMessageMatch[2], "bridge");
        }
        else {
            EventListener.post(GUILD_CHAT_EVENT_NAME, guildChatName, guildChatMessage, "guild");
        }
    }
});