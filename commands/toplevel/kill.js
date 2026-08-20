import { LocalStore } from "../../../tska/storage/LocalStore";
import { randomInt, probability, range } from "../../utils/commons";
import { registerSubcommand } from "../commands";
import { registerToplevelHandler } from "./toplevel";

const hospital = new LocalStore("FPLanguage", {
    yedel: {
        hp: 200,
        actors: []
    }
}, "data/persistent/hospital.json");

const GOOD = 1;
const GOOD_COMMANDS = ["heal", "aid"];
const GOOD_PROBABILITY = 0.75;
const GOOD_RANGE = range(10, 20);
const BAD = -1;
const BAD_COMMANDS = ["kill", "strike", "murder", "hurt"];
const BAD_PROBABILITY = 0.80;
const BAD_RANGE = range(20, 30);

registerToplevelHandler((source) => {
    const arg = source.args.get(0);
    let intent;
    if (GOOD_COMMANDS.includes(arg)) intent = GOOD;
    else if (BAD_COMMANDS.includes(arg)) intent = BAD;
    if (!intent) return;
    const name = (source.args.get(1) || source.args.get("name"))?.toLowerCase();
    if (!name) {
        source.respond("You must provide a player name to act on!", { antiSpam: true });
        return;
    }
    if (!hospital[name]) {
        hospital[name] = {
            hp: 100,
            actors: []
        };
    }
    if (name.equalsIgnoreCase(source.name) || name.equalsIgnoreCase("myself")) {
        source.respond(`You cannot act on yourself!`, { antiSpam: true });
        return;
    }
    if (hospital[name].hp <= 0) {
        source.respond(`${name} is already dead!`, { antiSpam: true });
        return;
    }
    let actor = source.name;
    if (hospital[name].actors.includes(actor)) {
        source.respond(`You already acted on ${name}!`, { antiSpam: true });
        return;
    }
    if (intent == GOOD) {
        if (probability(GOOD_PROBABILITY)) {
            if (hospital[name].hp == 100) {
                source.respond(`${name} is already at 100 HP! Ineffective heal...`);
                return;
            }
            let change = GOOD_RANGE();
            hospital[name].hp += change;
            if (hospital[name].hp > 100) hospital[name].hp = 100;
            source.respond(`You healed ${name} for ${change} HP (${hospital[name].hp} HP)!`, { antiSpam: true });
        }
        else {
            let change = BAD_RANGE();
            hospital[name].hp -= change;
            if (hospital[name].hp < 0) {
                hospital[name].hp = 0;
                source.respond(`You tried to heal ${name} but damaged them for ${change} HP instead, leaving them dead!`, { antiSpam: true });
            }
            else {
                source.respond(`You tried to heal ${name} but damaged them for ${change} HP instead (${hospital[name].hp} HP)!`, { antiSpam: true });
            }
        }
    }
    else {
        if (probability(BAD_PROBABILITY)) {
            let change = BAD_RANGE();
            hospital[name].hp -= change;
            if (hospital[name].hp < 0) {
                hospital[name].hp = 0;
                source.respond(`You struck ${name} for ${change} HP, leaving them dead!`, { antiSpam: true });
            }
            else {
                source.respond(`You struck ${name} for ${change} HP (${hospital[name].hp} HP)!`, { antiSpam: true });
            }
        }
        else {
            let change = GOOD_RANGE();
            hospital[name].hp += change;
            if (hospital[name].hp > 100) hospital[name].hp = 100;
            source.respond(`You tried to strike ${name} but healed them for ${change} HP instead (${hospital[name].hp} HP)!`, { antiSpam: true });
        }
    }
    hospital[name].actors.push(actor);
});

registerSubcommand("resethospital", (source) => {
    if (!source.admin) return;
    Object.keys(hospital).forEach((key) => {
        if (key != "getModuleData") {
            // the first ever usage of delete in js
            delete hospital[key];
        }
    })
    source.respond("Reset the hospital!");
});