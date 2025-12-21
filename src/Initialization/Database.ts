import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";
import { CommunityServerConnection } from "./MindustryCommunityServers";
import { config } from "../config";
import { terminal as t } from "terminal-kit";

export class DatabaseManager {
    static adapter = new PrismaBetterSqlite3({ url: config.DATABASE_URL });
    static prisma = new PrismaClient({ adapter: this.adapter });
    static active = false;
    
    static async connect() {
        try {
            await this.prisma.$connect();
            t.green("Database connected successfully.\n");
            this.active = true;
        } catch (error) {
            console.error("Error connecting to the database:", error);
        }
    }

    static async disconnect() {
        try {
            await this.prisma.$disconnect();
            t.green("Database disconnected successfully.\n");
            this.active = false;
        } catch (error) {
            console.error("Error disconnecting from the database:", error);
        }
    }


    // Registrar ou Atualizar um servidor
    static async registerServer(data: CommunityServerConnection) {
        return await this.prisma.communityServer.upsert({
            where: { token: data.token },
            update: {
                address: data.address,
                channelId: data.channelid
            },
            create: {
                token: data.token,
                address: data.address,
                authorId: data.authorid,
                channelId: data.channelid,
            }
        });
    }

    // Validar se o token enviado pelo Java existe no banco
    static async getServerByToken(token: string) {
        return await this.prisma.communityServer.findUnique({
            where: { token, active: true }
        });
    }

    static async deleteServerByToken(token: string) {
        return await this.prisma.communityServer.deleteMany({
            where: { token }
        });
    }
}

process.on("SIGINT", async () => {
    await DatabaseManager.prisma.$disconnect();
    process.exit(0);
});