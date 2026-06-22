import EventListener from "../../tska/event/EventListener";
import { GUILD_CHAT_EVENT_NAME } from "../utils/guildChatEvent";
import { approachHandleCommandMessage, handleCommandMessage } from "./commands";

EventListener.on(GUILD_CHAT_EVENT_NAME, (name, message, source) => {
    approachHandleCommandMessage(name, message, source == "guild" ? "guild_chat" : "bridge_bot");
});