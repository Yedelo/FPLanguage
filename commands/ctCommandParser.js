import { handleCommandMessage } from "./commands"

register("command", (...args) => {
    // i guess;
    args.unshift("!fplanguage");
    handleCommandMessage(Player.getName(), args.join(" "), "ct_command");
}).setName("fplanguage");