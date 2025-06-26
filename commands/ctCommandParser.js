import { handleCommandMessage } from "./commands"

register("command", (...args) => {
    handleCommandMessage(args.join(" "), "ct_command");
}).setName("fplanguage");