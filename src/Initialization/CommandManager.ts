import { CommandReturner } from "./../types";
import { REST, Routes } from "discord.js";
import { config } from "./../config";
import { Loader } from "./Loader";

export class CommandManager {
    static commands: Map<string, CommandReturner> = new Map();

    static registerCommand(command: CommandReturner) {
        this.commands.set(command.data.name, command);
    }

    static getCommand(name: string) {
        return this.commands?.get(name);
    }

    static async deploy(guildId: string) {
        const commandsData = Array.from(this.commands.values()).map((command) => command.data);
        const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);
        
        try {
          await rest.put(
            Routes.applicationGuildCommands(config.REACTOR_BOT_ID, guildId),
            {
              body: commandsData,
            }
          );
        } catch (error) {
        }
    }
}