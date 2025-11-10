import { CommandManager } from "../CommandManager";
import type { AllEventReturner } from "../types";

export default {
    name: "ready",
    once: true,
    execute(client) {
        client.guilds.cache.forEach(async (guild) => {
            await CommandManager.deploy(guild.id);
        });
    },
} satisfies AllEventReturner;