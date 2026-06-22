import { LocalStore } from "../../tska/storage/LocalStore";
import { registerSubcommand } from "../commands/commands";
import { randomInt } from "../utils/commons";
import { registerToplevelHandler } from "./toplevel";

const ratingCommands = new LocalStore("FPLanguage", {
    commands: [
        {
            name: "simple",
            format: "${playerName} is ${percent}% ${word}!",
            words: []
        },
        {
            name: "skill",
            format: "${playerName} is ${percent}% good at ${word}!",
            words: []
        },
        {
            name: "amount",
            format: "${playerName} has ${percent} ${word}!",
            words: []
        }
    ]
}, "data/persistent/ratingCommands.json");

registerToplevelHandler((name, args, sourceCallback) => {
    const wordArg = args.get(0);
    const playerName = args.get(1) ?? name;
    ratingCommands.commands.forEach((command) => {
        command.words.forEach((word) => {
            if (wordArg == word.word) {
                const percent = word.overrides[playerName] ?? randomInt(word.min ?? command.min ?? 0, word.max ?? command.max ?? 101);
                const message = (word.format ?? command.format)
                    .replaceAll("${playerName}", playerName)
                    .replaceAll("${percent}", percent)
                    .replaceAll("${word}", word.word);
                sourceCallback(name, message);
            }
        });
    });
});

registerSubcommand("addword", (name, args, sourceCallback, admin) => {
    if (!admin) return;
    const commandArg = args.get("command") || args.get(0);
    if (!commandArg) {
        sourceCallback(name, "§cYou must provide a command type!");
        return;
    }
    const command = ratingCommands.commands.find((command) => command.name == commandArg);
    if (!command) {
        sourceCallback(name, `§cNo command found with name ${commandArg}!`);
        return;
    }
    const wordArg = args.get("word") || args.get(1);
    if (!wordArg) {
        sourceCallback(name, "§cYou must provide a word to add!");
        return;
    }
    for (alsoCommand of ratingCommands.commands) {
        for (word of alsoCommand.words) {
            if (wordArg == word.word) {
                sourceCallback(name, `§cCommand "${alsoCommand.name}" already has the word "${wordArg}"!`);
                return;
            }
        }
    }
    command.words.push(
        {
            word: wordArg,
            overrides: new Map
        }
    );
    sourceCallback(name, `Added word "${wordArg}" to command ${commandArg}!`);
});

registerSubcommand("removeword", (name, args, sourceCallback, admin) => {
    if (!admin) return;
    const wordArg = args.get("word") || args.get(0);
    if (!wordArg) {
        sourceCallback(name, "§cYou must provide a word to remove!");
    }
    for (let command of ratingCommands.commands) {
        command.words = command.words.filter((word) => word.word != wordArg);
    }
    sourceCallback(name, `Cleared all instances of "${wordArg}".`);   
});