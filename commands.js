import { LOGO } from "./commons";

register("command", (...args) => {
    let firstArg = args[0];
    let secondArg = args[1];
    if (firstArg) {
        switch (firstArg) {
            default:
                ChatLib.chat(`${LOGO} §cNo subcommand found with name ${firstArg}!`);    
        }
    }
    else {
        ChatLib.chat(`${LOGO} §cNo argument given!`);
    }
}).setName("fplanguage");