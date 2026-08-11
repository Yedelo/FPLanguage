import { LocalStore } from "../../tska/storage/LocalStore";
import { registerSubcommand } from "../commands/commands";
import { randomElement, randomInt } from "../utils/commons";
import { registerToplevelHandler } from "./toplevel";

const ratingCommands = new LocalStore("FPLanguage", {
    commands: [
        {
            name: "simple",
            format: "${playerName} is ${percent}% ${word}!",
            words: [
                {
                    word: "goated"
                }
            ]
        },
        {
            name: "skill",
            format: "${playerName} is ${percent}% good at ${word}!",
            words: [
                {
                    word: "bedwars"
                }
            ]
        },
        {
            name: "amount",
            format: "${playerName} has ${percent} ${word}!",
            words: [
                {
                    word: "iq",
                    min: 30,
                    max: 200,
                    overrides: {
                        Yedel: 250
                    }
                }
            ]
        }
    ]
}, "data/persistent/ratingCommands.json");

registerToplevelHandler((source) => {
    const firstArg = source.args.get(0);
    const playerName = source.args.get(1) ?? source.name;
    let matchedCommand;
    let matchedWord;
    if (["randomrating", "imfeelinglucky"].includes(firstArg)) {
        matchedCommand = randomElement(ratingCommands.commands);
        matchedWord = randomElement(matchedCommand.words);
    }
    else {
        ratingCommands.commands.forEach((command) => {
            command.words.forEach((word) => {
                if (firstArg == word.word) {
                    matchedCommand = command;
                    matchedWord = word;
                }
            });
        });
    }
    if (matchedCommand && matchedWord) {
        const percent = matchedWord.overrides?.[playerName] ?? randomInt(matchedWord.min ?? matchedCommand.min ?? 0, matchedWord.max ?? matchedCommand.max ?? 101);
        const message = (matchedWord.format ?? matchedCommand.format)
            .replaceAll("${playerName}", playerName)
            .replaceAll("${percent}", percent)
            .replaceAll("${word}", matchedWord.word);
        source.respond(message);
    }
});

registerSubcommand("addword", (source) => {
    if (!source.admin) return;
    const commandArg = source.args.get("command") || source.args.get(0);
    if (!commandArg) {
        source.respond("§cYou must provide a command type!");
        return;
    }
    const command = ratingCommands.commands.find((command) => command.name == commandArg);
    if (!command) {
        source.respond(`§cNo command found with name ${commandArg}!`);
        return;
    }
    const wordArg = source.args.get("word") || source.args.get(1);
    if (!wordArg) {
        source.respond("§cYou must provide a word to add!");
        return;
    }
    for (alsoCommand of ratingCommands.commands) {
        for (word of alsoCommand.words) {
            if (wordArg == word.word) {
                source.respond(`§cCommand "${alsoCommand.name}" already has the word "${wordArg}"!`);
                return;
            }
        }
    }
    command.words.push(
        {
            word: wordArg
        }
    );
    source.respond(`Added word "${wordArg}" to command ${commandArg}!`);
});

// /fplanguage addoverride iq yedel 250
registerSubcommand("addoverride", (source) => {
    if (!source.admin) return;
    const wordArg = source.args.get("word") || source.args.get(0);
    if (!wordArg) {
        source.respond("§cYou must provide a word to override!");
        return;
    }
    const nameArg = source.args.get("name") || source.args.get(1);
    if (!nameArg) {
        source.respond("§cYou must provide a name to override for!");
        return;
    }
    const valueArg = source.args.get("value") || source.args.get(2);
    if (!valueArg) {
        source.respond("§cYou must provide a value to override with!");
        return;
    }
    for (let command of ratingCommands.commands) {
        for (let word of command.words) {
            if (word.word == wordArg) {
                if (!word.overrides) word.overrides = new Map();
                word.overrides[nameArg] = valueArg;
                source.respond(`Set override for word "${wordArg}" to ${valueArg} for ${nameArg}!`);
                return;
            }
        }
    }
    source.respond(`§cCouldn't find word "${wordArg}"!`)
});

registerSubcommand("removeword", (source) => {
    if (!source.respond) return;
    const wordArg = source.args.get("word") || source.args.get(0);
    if (!wordArg) {
        source.respond("§cYou must provide a word to remove!");
        return;
    }
    for (let command of ratingCommands.commands) {
        command.words = command.words.filter((word) => word.word != wordArg);
    }
    source.respond(`Cleared all instances of "${wordArg}".`);
});