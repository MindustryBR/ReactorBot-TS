import express from "express";
import rateLimit from 'express-rate-limit';
import { config } from "../config";
import * as dns from "dns";
import { promisify } from "util";
import { Loader } from "./Loader";
import { TextChannel, User } from "discord.js";
import { DatabaseManager } from "./Database";

export interface CommunityServerConnection {
    address: string;
    token: string;
    authorid: string;
    channelid: string;
}

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { error: "Muitas requisições. Maneira aí!" },
    standardHeaders: true,
    legacyHeaders: false,
});
    
// adicionar uma database
// testar o sistema de verificação de texto
// fixar o canal dar permissão para todomundo ler

export class MindustryCommunityServers {
    static started: boolean = false;
    static CommunityServers: Map<string, CommunityServerConnection> = new Map();
    static channelMessageCache = new Map<string, {
        user: string;
        username: string;
        content: string;
        timestamp: number;
    }[]>();

    static readonly CommunityOwnerAllowOverwrites = 7388872757865553n;
    static readonly CommunityOwnerDenyOverwrites = 1126830572703744n;


    static initialize() {
        const PORT = config.MINDUSTRY_COMMUNITY_PORT;
        const Address = config.MINDUSTRY_COMMUNITY_ADDRESS;
        if (!PORT || !Address) return;

        DatabaseManager.prisma.communityServer.findMany({ where: { active: true } }).then(servers => {
            servers.forEach(server => {
                this.CommunityServers.set(server.token, {
                    address: server.address,
                    token: server.token,
                    authorid: server.authorId,
                    channelid: server.channelId,
                });
                this.channelMessageCache.set(server.channelId, []);
            });
        });

        const app = express();
        app.use(express.json());
        app.use(limiter);
        app.set('trust proxy', 1)
        app.post("/send", (req, res) => {
            const server = this.getConnection(req);
            if (!server) return res.sendStatus(403);
            const { content } = req.body;
            const filteredContent = this.filterContent(content);
            const channel = Loader.client.channels.cache.get(server.channelid) as TextChannel;
            if (content) channel.send(filteredContent);
            res.sendStatus(200);
        });
        app.post("/sync", (req, res) => {
            const server = this.getConnection(req);
            if (!server) return res.sendStatus(403);
            const messages = this.channelMessageCache.get(server.channelid)!;
            this.channelMessageCache.set(server.channelid, []);
            res.send(messages);
        });
        app.get("/", (req, res) => {
            res.send({
                discordName: "MindustryBr",
                discordInvite: Loader.InviteLink,
            });
        });
        app.listen(PORT, () => {
            console.log(`Mindustry Community Servers is running on port ${PORT}.`);
        });
        this.started = true;
    }

    static filterContent(content: string): string {
        return content.replace(/@everyone/g, "@\u00AD­­everyone").replace(/@here/g, "@\u00ADhere");
    }

    static getConnection(req: express.Request): CommunityServerConnection | null {
        const token = req.header('Authorization')?.slice(7); // Remove "Bearer " prefix
        if (!token) return null;
        const server = this.CommunityServers.get(token);
        if (!server) return null;
        return server;
    }

    static async addCommunityServer(adressandport: string, author: User, channel: TextChannel): Promise<string> {
        if (!this.started) return "O sistema de servidores comunitários não foi iniciado.";
        try {
            await promisify(dns.lookup);
        } catch (error) {
            return "Endereço inválido fornecido para o servidor comunitário.";
        }
        
        
        this.setChannelMaster(channel, author);
        const oldServerSameAddress = Array.from(this.CommunityServers.values()).find(s => s.address === adressandport);
        if (oldServerSameAddress && oldServerSameAddress.channelid !== channel.id) {
            this.removeCommunityServer(oldServerSameAddress);
        }
        
        const server: CommunityServerConnection = {
            address: adressandport,
            token: crypto.randomUUID(),
            authorid: author.id,
            channelid: channel.id,
        };

        this.CommunityServers.set(server.token, server);
        this.channelMessageCache.set(server.channelid, []);
        author.send("Seu servidor comunitário foi adicionado!\nEnvie o comando no terminal:\n```discordconnect " + config.MINDUSTRY_COMMUNITY_ADDRESS + " " + server.token + "```\n*NÃO COMPARTILHE ESTE TOKEN*");
        DatabaseManager.registerServer(server);
        return "Esperando conexão do servidor comunitário...";
    }

    static setChannelMaster(channel: TextChannel, user: User | null) {
        const fixedOverwrites = [
            {
                id: '700183808783286372',
                deny: 1024n,
                allow: 0n
            }, {
                id: '699823229354639471',
                // Com everyone vendo
                deny: 7882247193636880n,
                allow: 633456136932417n

                // Sem everyone ver
                // deny: 7882247193637904n,
                // allow: 633456136931393n
            }, {
                id: '755665930159390721',
                deny: 2048n,
                allow: 0n
            }
        ];

        if (!user) {
            if (channel.permissionOverwrites.cache.size === fixedOverwrites.length) return;
            channel.permissionOverwrites.set(fixedOverwrites);
            return;
        }
        if (channel.permissionOverwrites.cache.get(user.id)) return;
        channel.permissionOverwrites.set([...fixedOverwrites, {
            id: user.id,
            allow: this.CommunityOwnerAllowOverwrites,
            deny: this.CommunityOwnerDenyOverwrites,
        }])
    }

    static removeCommunityServer(oldServer: CommunityServerConnection) {
        this.CommunityServers.delete(oldServer.token);
        const channel = Loader.client.channels.cache.get(oldServer.channelid) as TextChannel;
        this.setChannelMaster(channel, null);
        channel.send("O servidor comunitário foi removido!");
        DatabaseManager.deleteServerByToken(oldServer.token);
    }
}