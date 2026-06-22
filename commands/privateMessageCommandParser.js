import { FPL_COMMAND_PREFIX, approachHandleCommandMessage } from "./commands";

const PRIVATE_MESSAGE_REGEX = /From (?:\[.*\] )?(.*): (.*)/;

register("chat", (name, message) => {
    approachHandleCommandMessage(name, message, "private_message");
}).setCriteria(PRIVATE_MESSAGE_REGEX);