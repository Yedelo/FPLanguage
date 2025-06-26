import { handleCommandMessage } from "./commands"

register("command", (...args) => {
    handleCommandMessage(Player.getName(), args.join(" "), "ct_command");
}).setName("fplanguage");