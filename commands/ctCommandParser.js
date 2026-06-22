import { handleCommandMessage } from "./commands"

register("command", (...args) => {
    // i guess;
    args.unshift("!fplanguage");
    handleCommandMessage(Player.getName(), args.join(" "), "ct_command");
}).setName("fplanguage").setAliases("fpl");

register("command", (...args) => {
    const name = args[0];
    const source = args[1];
    handleCommandMessage(name, args.slice(1).join(" "), source);
}).setName("fplanguageq").setAliases("fplq");