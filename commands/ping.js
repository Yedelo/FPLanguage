import { registerSubcommand } from "./commands";

registerSubcommand("ping", (source) => {
    source.respond("Pong!", { antiSpam: true });
});

registerSubcommand("pong", (source) => {
    source.respond("Ping!", { antiSpam: true });
});

