import { CommandManager } from "../CommandManager";
import { Loader} from "../Loader";
import type { AllEventReturner } from "../types";

export default {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = CommandManager.getCommand(interaction.commandName);
            if (!command) throw new Error(`No command found for ${interaction.commandName}`);
            try {
                await command.execute(Loader.client,interaction);
            } catch (error) {
                console.error(`Error executing command ${interaction.commandName}:`, error);
            }
        }
    },
} satisfies AllEventReturner;