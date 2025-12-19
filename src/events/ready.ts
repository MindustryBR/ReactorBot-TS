import { CommandManager } from "../Initialization/CommandManager";
import type { AllEventReturner } from "../types";
import { terminal as t } from "terminal-kit";

export default {
    name: "ready",
    once: true,
    execute(client) {                        
        client.guilds.cache.forEach(async (guild) => {
            await CommandManager.deploy(guild.id);
        });
    },
} satisfies AllEventReturner;