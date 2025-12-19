import { CommandManager } from "../Initialization/CommandManager";
import { Loader} from "../Initialization/Loader";
import type { AllEventReturner } from "../types";
import { terminal as t } from "terminal-kit";

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
        if (interaction.isButton()) {
            if (interaction.customId === 'get_schematic_base64') {
                const message = interaction.message;
                const schematicAttachment = message.attachments.find(att => att.name.endsWith('.msch'));
                if (!schematicAttachment) {
                    await interaction.reply({ content: 'No schematic attachment found.', ephemeral: true });
                    return;
                }
                const buffer = Buffer.from(await (await fetch(schematicAttachment.url)).arrayBuffer());
                const base64Schematic = buffer.toString('base64');
                await interaction.reply({ content: "```"+base64Schematic+"```", ephemeral: true });
            }
        }
    },
} satisfies AllEventReturner;