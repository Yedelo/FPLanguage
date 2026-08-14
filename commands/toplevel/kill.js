import { LocalStore } from "../../../tska/storage/LocalStore";
import { randomInt, probability } from "../../utils/commons";
import { registerToplevelCommand } from "./toplevel";

const hospital = new LocalStore("FPLanguage", {
    yedel: {
        hp: 200,
        strikers: []
    }
}, "data/persistent/hospital.json");

registerToplevelCommand("kill", (source) => {
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
    if (name.equalsIgnoreCase(source.name)) {
        source.respond(`You cannot do that to yourself!`, { antiSpam: true });
        return;
    }
    if (hospital[name].hp <= 0) {
        source.respond(`${name} is already dead! Ineffective strike...`, { antiSpam: true });
        return;
    }
    let striker = source.name;
    if (hospital[name].strikers.includes(striker)) {
        source.respond(`You already striked ${name}!`, { antiSpam: true });
        return;
    }
    let change = randomInt(10, 20);
    if (probability(0.75)) {
    hospital[name].hp -= change;
    if (hospital[name].hp <= 0) {
        source.respond(`You dealt ${change} damage, leaving ${name} dead!`, { antiSpam: true });
        return;
    }
    source.respond(`You dealt ${change} damage, ${name} is now at ${hospital[name].hp} HP!`, { antiSpam: true });
}
else {
    hospital[name].hp += change;
    if (hospital[name].hp > 100) {
        hospital[name].hp = 100;
    }
    source.respond(`You tried to strike ${name}, but instead healed them for ${change} HP! ${name} is now at ${hospital[name].hp} HP!`, { antiSpam: true });
}  
    hospital[name].strikers.push(striker);
});