import { registerSubcommand } from "../commands/commands";

registerSubcommand("toplevel", (name, args, sourceCallback) => {
    console.log("Made it to toplevel");
    console.log(`Name: ${name}`);
    console.log(`Args: ${Array.from(args)}`)
    
});