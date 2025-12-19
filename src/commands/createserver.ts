import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandReturner } from "../types";
import { MindustryCommunityServers } from "../Initialization/MindustryCommunityServers";

export default {
  data: new SlashCommandBuilder()
  .setName("createserverhere")
  .setDescription("Cria um novo servidor.")
  .addStringOption(option => 
    option.setName("endereço")
    .setDescription("O endereço do servidor")
    .setRequired(true))
  .addUserOption(option => 
    option.setName("autor")
    .setDescription("O autor do servidor")
    .setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction) {
    MindustryCommunityServers.addCommunityServer(
      interaction.options.getString("endereço", true),
      interaction.options.getUser("autor", true),
      interaction.channel
    );
  }
} as CommandReturner;