import type { AllEventReturner } from "../types";
import { Loader } from "../Loader";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { MindustrySchematicManager } from "../MindustrySchematicManager";
import { terminal as t } from "terminal-kit";
const { client } = Loader;

export default {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot) return;

        const content = message.content;
        let buffer = null;
        if (content.startsWith("bXNja")) {
            buffer = Buffer.from(content, 'base64');
        } else if (content.startsWith("```bXNja")) {
            const base64Content = /```\s*(bXNja[^`]*?)\s*?```/s.exec(content)?.[1];
            if (base64Content) buffer = Buffer.from(base64Content, 'base64');
        } else if (message.attachments.size > 0) {
            const att = message.attachments.find(at => at.name.endsWith('.msch'));
            if (att) {
                if (att.size > 6 * 1024 * 1024) {
                    message.channel.send("Attachment is too large. Maximum size is 6MB.");
                    return;
                }
                buffer = Buffer.from(await (await fetch(att.url)).arrayBuffer());
            }
        }
        if (buffer) {
            const schematic = MindustrySchematicManager.CreateSchematic(buffer);
            const img = MindustrySchematicManager.imageFromSchematic(schematic);
            const name = schematic.tags?.name || "Esquema";
            const embed = new EmbedBuilder()
                .setTitle(name)
                .setDescription(schematic.tags?.description || "Sem descrição.")
                .setColor(0x00AE86)
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setImage('attachment://schematic.png')
                .setTimestamp();

            const btn = new ButtonBuilder()
                .setCustomId('get_schematic_base64')
                .setLabel('Obter código')
                .setStyle(1);
            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(btn);

            // console.log(schematic.unknownBlocksNames);

            message.channel.send({
                embeds: [embed], files: [
                    { attachment: img, name: 'schematic.png' },
                    { attachment: buffer, name: `${name}.msch` },
                ], components: [row.toJSON()]
            });
            if(!message.channel.isDMBased()) await message.delete()
        }
    },
} satisfies AllEventReturner;