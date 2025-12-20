import dotenv from "dotenv";
import {terminal as t} from "terminal-kit";

dotenv.config();

const { DISCORD_TOKEN, MINDUSTRY_COMMUNITY_ADDRESS, MINDUSTRY_COMMUNITY_PORT, DATABASE_URL, REACTOR_BOT_ID } = process.env;

if(!DISCORD_TOKEN) throw new Error("Missing environment variable DISCORD_TOKEN");
if(!REACTOR_BOT_ID) throw new Error("Missing environment variable REACTOR_BOT_ID");
if(!MINDUSTRY_COMMUNITY_ADDRESS) t.yellow("Warning: MINDUSTRY_COMMUNITY_ADDRESS is not set. Community server features will be disabled.\n");
if(MINDUSTRY_COMMUNITY_PORT && isNaN(parseInt(MINDUSTRY_COMMUNITY_PORT))) t.yellow("MINDUSTRY_COMMUNITY_PORT must be a valid number. Community server features will be disabled.\n");
if(!DATABASE_URL) throw new Error ("Missing environment variable DATABASE_URL\n");

export const config = {
  DISCORD_TOKEN,
  REACTOR_BOT_ID,
  MINDUSTRY_COMMUNITY_ADDRESS: MINDUSTRY_COMMUNITY_ADDRESS || null,
  MINDUSTRY_COMMUNITY_PORT: MINDUSTRY_COMMUNITY_PORT ? parseInt(MINDUSTRY_COMMUNITY_PORT) : null,
  DATABASE_URL: DATABASE_URL || "",
};