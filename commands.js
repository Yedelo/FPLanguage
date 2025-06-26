import { LOGO } from "./commons";
import { regexStore } from "./collector";

register("command", (...args) => {
    let firstArg = args[0];
    let secondArg = args[1];
    if (firstArg) {
        switch (firstArg) {
            case "regex":
                let newRegex = args.slice(2).join(" ");
                if (secondArg == "guild") {
                    regexStore.guildChatRegex = newRegex;
                    ChatLib.chat(`${LOGO} §eSet guild chat regex to "§f${newRegex}"`);
                }
                else if (secondArg == "bridge") {
                    regexStore.bridgeMessageRegex = newRegex;
                    ChatLib.chat(`${LOGO} §eSet bridge message regex to "§f${newRegex}"`);
                }
                else {
                    ChatLib.chat(`${LOGO} §cCouldn't find which regex to set!`);
                }
                break;
            default:
                ChatLib.chat(`${LOGO} §cNo subcommand found with name ${firstArg}!`);    
        }
    }
    else {
        ChatLib.chat(`${LOGO} §cNo argument given!`);
    }
}).setName("fplanguage");