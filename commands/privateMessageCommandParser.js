import { COMMAND_PREFIX, handleCommandMessage } from "./commands";

const PRIVATE_MESSAGE_REGEX = /From (?:\[.*\] )?(.*): (.*)/;

register("chat", (name, message) => {
    if (message.startsWith(COMMAND_PREFIX)) {
        handleCommandMessage(name, message.substring(12), "private_message");
    }
}).setCriteria(PRIVATE_MESSAGE_REGEX);