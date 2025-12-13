import { Client, Partials } from "discord.js";
import { config } from "./config";
import fs from "fs";
import { MultiProgressBar } from "./TerminalKitPlus";
import { AllEventReturner, CommandReturner } from "./types";
import { CommandManager } from "./CommandManager";
import { terminal as t } from "terminal-kit";

type defaultModule<T> = { __esModule: boolean, default: { default: T } };

export class Loader {
    static client = new Client({
        intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
        partials: [
            Partials.Channel
        ]
    });

    static load(): void {
        const client = this.client;
        const eventFiles = fs.readdirSync("./dist/events").filter((file) => file.endsWith(".js"));
        const commandFiles = fs.readdirSync("./dist/commands").filter((file) => file.endsWith(".js"));
        const guildsToDeploy: string[] = [];

        t.yellow("Inicializando:\n");
        const eventProgress = new MultiProgressBar();
        eventProgress.addBar('Eventos');
        eventProgress.addBar('Comandos');
        eventProgress.display();

        const LoadingStatus = {
            eventsLoaded: 0,
            commandsLoaded: 0,
            totalEvents: eventFiles.length,
            totalCommands: commandFiles.length,
        };

        Loader.LoadEvents(eventFiles, client, LoadingStatus, eventProgress);
        Loader.LoadCommands(commandFiles, LoadingStatus, eventProgress);

        eventProgress.onComplete = () => {
            t.green("\nTodos os eventos e comandos foram carregados com sucesso!\n");
            client.login(config.DISCORD_TOKEN);
            t.green("Bot conectado ao Discord!\n");
        };
    }

    private static LoadCommands(commandFiles: string[], LoadingStatus: { eventsLoaded: number; commandsLoaded: number; totalEvents: number; totalCommands: number; }, eventProgress: MultiProgressBar) {
        for (const cFile of commandFiles) {
            const imported = import(`./commands/${cFile}`);
            imported.then((commandModule: defaultModule<CommandReturner>) => {
                const name = cFile.split(".")[0]!;
                CommandManager.registerCommand(commandModule.default.default);
                let commandsLoaded = ++LoadingStatus.commandsLoaded;
                eventProgress.update("Comandos", commandsLoaded / LoadingStatus.totalCommands);
            });
        }
    }

    private static LoadEvents(eventFiles: string[], client: Client<boolean>, LoadingStatus: { eventsLoaded: number; commandsLoaded: number; totalEvents: number; totalCommands: number; }, eventProgress: MultiProgressBar) {
        for (const eFile of eventFiles) {
            const imported = import(`./events/${eFile}`);
            imported.then((eventModule: defaultModule<AllEventReturner>) => {
                const event = eventModule.default.default;
                let fn = event.once ? client.once : client.on;


                fn.call(client, event.name, async (...args) => {
                    try {
                        await (event.execute as any)(...args);
                    } catch (error) {
                        console.error(`Error executing event ${event.name}:`, error);
                    }
                });
                let eventsLoaded = ++LoadingStatus.eventsLoaded;
                eventProgress.update("Eventos", eventsLoaded / LoadingStatus.totalEvents);
            });
        }
    }

    static async reload() {
        await this.client.destroy();
        this.load();
    }
}