import { randomInt } from "../utils/commons";
import { registerToplevelCommand } from "./toplevel";

const REFRESH_DELAY = 3600;
const guildValueMap = new Map();

registerToplevelCommand("guildvalue", (name, args, sourceCallback) => {
    const playerName = args.get(1) ?? name;
    if (!guildValueMap.has(playerName)) {
        // we don't like positivity around here
        guildValueMap.set(playerName, randomInt(-100000, 50000));
    }
    const totalGuildValue = [...guildValueMap.values()].reduce((a, b) => a + b);
    sourceCallback(`Guild value is currently ${totalGuildValue}, ${playerName} is changing it by ${guildValueMap.get(playerName)}!`);
});

// would be nice if this was not a chattriggers thing but it works for now
register("step", () => {
    guildValueMap.clear();
}).setDelay(REFRESH_DELAY);