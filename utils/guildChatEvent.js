import EventListener from "../../tska/event/EventListener";

export const GUILD_CHAT_EVENT_NAME = "fplanguage:guild_chat_event";
const GUILD_CHAT_REGEX = /Guild > (?:\[.*\] )?(.*) \[.*\]: (.*)/;
const BRIDGE_MESSAGE_REGEX = /([^ ]*)(?: replying to .*)? » (.*)/;

EventListener.createEvent(GUILD_CHAT_EVENT_NAME);

register("chat", (event) => {
    let chatMessage = removeProperFormatting(event.message.func_150254_d());
    let guildChatMatch = GUILD_CHAT_REGEX.exec(chatMessage);
    if (guildChatMatch?.length >= 3) {
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

function removeProperFormatting(text) {
	return text.replace(/§[0-9a-fk-or]/g, "")
}
