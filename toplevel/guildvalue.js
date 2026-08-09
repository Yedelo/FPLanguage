import { internal, registerSubcommand } from "../commands/commands";
import { randomInt } from "../utils/commons";
import { registerToplevelCommand } from "./toplevel";

const REFRESH_DELAY = 3600;
const guildValueMap = new Map();

registerToplevelCommand("guildvalue", (source) => {
    const playerName = source.name;
    if (!guildValueMap.has(playerName)) {
        guildValueMap.set(playerName, randomInt(-100000, 100000));
    }
    const totalGuildValue = [...guildValueMap.values()].reduce((a, b) => a + b);
    source.respond(`Guild value is currently ${totalGuildValue}, ${playerName} is changing it by ${guildValueMap.get(playerName)}!`);
});

function clearGuildValueMap() {
    guildValueMap.clear();
    internal("Cleared guild value map!");
}

registerSubcommand("clearguildvalue", (source) => {
    if (!source.admin) return;
    clearGuildValueMap();
});

// would be nice if this was not a chattriggers thing but it works for now
register("step", () => {
    clearGuildValueMap();
}).setDelay(REFRESH_DELAY);