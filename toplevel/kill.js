import { LocalStore } from "../../tska/storage/LocalStore";
import { randomInt } from "../utils/commons";
import { registerToplevelCommand } from "./toplevel";

const hospital = new LocalStore("FPLanguage", {
    yedel: {
        hp: 200,
        damagers: []
    }
}, "data/persistent/hospital.json");

registerToplevelCommand("kill", (source) => {
    const name = (source.args.get(1) || source.args.get("name")).toLowerCase();
    if (!name) {
        source.respond("You must provide a player name to kill!", { antiSpam: true });
        return;
    }
    if (!hospital[name]) {
        hospital[name] = {
            hp: 100,
            damagers: []
        };
    }
    if (name.equalsIgnoreCase(source.name)) {
        source.respond(`You cannot do that to yourself!`, { antiSpam: true });
        return;
    }
    if (hospital[name].hp <= 0) {
        source.respond(`${name} is already dead! Ineffective strike...`, { antiSpam: true });
        return;
    }
    let attacker = source.name;
    if (hospital[name].damagers.includes(attacker)) {
        source.respond(`You already attacked ${name}!`, { antiSpam: true });
        return;
    }
    let damage = randomInt(10, 20);
    hospital[name].hp -= damage;
    if (hospital[name].hp <= 0) {
        source.respond(`You dealt ${damage} damage, leaving ${name} dead!`, { antiSpam: true });
        return;
    }
    source.respond(`You dealt ${damage} damage, ${name} is now at ${hospital[name].hp} hp!`, { antiSpam: true });
    hospital[name].damagers.push(attacker);
});