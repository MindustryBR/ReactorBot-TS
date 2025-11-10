import { ClientEvents, SlashCommandBuilder } from "discord.js";

interface EventReturner<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (...args: ClientEvents[K]) => Promise<void> | void;
};

export type AllEventReturner = {
    [K in keyof ClientEvents]: EventReturner<K>;
}[keyof ClientEvents];

export interface CommandReturner {
    data: SlashCommandBuilder;
    execute: (client: Client<true>, interaction: CommandInteraction) => Promise<void> | void;
}