import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

if(!DISCORD_TOKEN) throw new Error("Missing environment variable DISCORD_TOKEN");
if(!DISCORD_CLIENT_ID) throw new Error("Missing environment variable DISCORD_CLIENT_ID");

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
};