import { LOGO } from "./commons";

export function handleError(errorMessage, error) {
    if (error) {
        ChatLib.chat(`${LOGO} §c${errorMessage} (${error})`);
    }
    else {
        ChatLib.chat(`${LOGO} §c${errorMessage}`);
    }
}