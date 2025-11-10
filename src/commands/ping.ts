import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandReturner } from "../types";

export default {
  data: new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!"),
  
  async execute(client, interaction) {
    return interaction.reply("Pong!");
  }
} as CommandReturner;