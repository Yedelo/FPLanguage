import { LocalStore } from "../../../tska/storage/LocalStore";
import { randomInt, probability } from "../../utils/commons";
import { registerToplevelHandler } from "./toplevel";

const hospital = new LocalStore("FPLanguage", {
    yedel: {
        hp: 200,
        strikers: []
    }
}, "data/persistent/hospital.json");

registerToplevelHandler((source) => {
    if (!["kill", "heal", "strike"].includes(source.args.get(0))) return;
    const name = (source.args.get(1) || source.args.get("name"))?.toLowerCase();
    if (!name) {
        source.respond("You must provide a player name to kill!", { antiSpam: true });
        return;
    }
    if (!hospital[name]) {
        hospital[name] = {
            hp: 100,
            strikers: []
        };
    }
    if (name.equalsIgnoreCase(source.name) || name.equalsIgnoreCase("myself")) {
        source.respond(`You cannot do that to yourself!`, { antiSpam: true });
        return;
    }
    let striker = source.name;
    if (hospital[name].strikers.includes(striker)) {
        source.respond(`You already striked ${name}!`, { antiSpam: true });
        return;
    }
    let change = randomInt(10, 20);
    if (probability(0.75)) {
        if (hospital[name].hp <= 0) {
            source.respond(`${name} is already dead! Ineffective strike...`, { antiSpam: true });
            return;
        }
        hospital[name].hp -= change;
        if (hospital[name].hp <= 0) {
            source.respond(`You dealt ${change} damage, leaving ${name} dead!`, { antiSpam: true });
            hospital[name].hp = 0;
            return;
        }
        source.respond(`You dealt ${change} damage, ${name} is now at ${hospital[name].hp} HP!`, { antiSpam: true });
    }
    else {
        if (hospital[name].hp <= 0) {
            hospital[name].hp += change;
            source.respond(`${name} was dead, but you healed them for ${change} back to ${hospital[name].hp} HP!`, { antiSpam: true });
            return;
        }
        hospital[name].hp += change;
        source.respond(`You tried to strike ${name}, but instead healed them for ${change} HP! ${name} is now at ${hospital[name].hp} HP!`, { antiSpam: true });
    }  
    hospital[name].strikers.push(striker);
});