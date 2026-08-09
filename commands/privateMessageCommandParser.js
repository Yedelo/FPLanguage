import { FPL_COMMAND_PREFIX, approachHandleCommandMessage } from "./commands";

const PRIVATE_MESSAGE_REGEX = /From (?:\[.*\] )?(.*): (.*)/;

register("chat", (name, message, event) => {
    // The regex is matched, but ampersand formatting is wiped.
    // We have to get the raw message from the event, reformat it to remove section symbols, 
    // then obtain the ampersand-formatted message from there.
    const realChatText = removeProperFormatting(event.message.func_150254_d());
    const result = PRIVATE_MESSAGE_REGEX.exec(realChatText);
    const realMessage = result[2];

    approachHandleCommandMessage(name, realMessage, "private_message");
}).setCriteria(PRIVATE_MESSAGE_REGEX);

function removeProperFormatting(text) {
	return text.replaceAll(/§[0-9a-fk-or]/g, "")
}
