import { LocalStore } from "../tska/storage/LocalStore";
import EventListener from "../tska/event/EventListener";
import { GUILD_CHAT_EVENT_NAME } from "./guildChatEvent";

export const messageStore = new LocalStore("FPLanguage", {
    messages: []
}, "data/persistent/messageStore.json");

EventListener.on(GUILD_CHAT_EVENT_NAME, (name, message, source) => {
    let messageInfo = {
        name: name,
        message: message.removeFormatting(),
        source: source
    };
    messageStore.messages.push(messageInfo);
});