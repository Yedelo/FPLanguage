import EventListener from "../../tska/event/EventListener";
import { GUILD_CHAT_EVENT_NAME } from "../guildChatEvent";
import { COMMAND_PREFIX, handleCommandMessage } from "./commands";

EventListener.on(GUILD_CHAT_EVENT_NAME, (name, message, source) => {
    if (message.startsWith(COMMAND_PREFIX)) {
        handleCommandMessage(message.substring(12), source == "guild" ? "guild_chat" : "bridge_bot");
    }
});