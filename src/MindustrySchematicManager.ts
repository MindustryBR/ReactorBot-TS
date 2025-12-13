import { Emoji } from "discord.js";
import {Schematic} from "mindustry-schematic"
import {vanillaSchematicAddon} from "mindustry-schematic/vanilla-addon"

export class MindustrySchematicManager {

    static CreateSchematic(buffer: Buffer): Schematic {
        const loadedSchematic = new Schematic().setAddon(vanillaSchematicAddon);
        loadedSchematic.setFrom(buffer);
        return loadedSchematic;
    }

    static imageFromSchematic(schematic: Schematic): Buffer {
        return schematic.toImageBuffer();
    }

    static itemToEmoji(itemName: string): string | null {
        switch (itemName) {
            case "copper": return "<:copper:860642323976421407>";
            case "lead": return "<:lead:860642323964887101>";
            case "metaglass": return "<:metaglass:860642324212219965>";
            case "graphite": return "<:graphite:860642324258095114>";
            case "sand": return "<:sand:860643756482756608>";
            case "coal": return "<:coal:860642324206977044>";
            case "titanium": return "<:titanium:860642324324941834>";
            case "thorium": return "<:thorium:860642324278149131>";
            case "scrap": return "<:scrap:860642324342374400>";
            case "silicon": return "<:silicon:860642324286275594>";
            case "plastanium": return "<:plastanium:860642324245512202>";
            case "phase-fabric": return "<:phase_fabric:860642324244856872>";
            case "surge-alloy": return "<:surge_alloy:860642324195573810>";
            case "spore-pod": return "<:spore_pod:860642323889389569>";
            case "blast-compound": return "<:blast_compound:860642324316684298>";
            case "pyratite": return "<:pyratite:860642324237254656>";

            case "beryllium": return "<:beryllium:1449502880104185906>";
            case "tungsten": return "<:tungsten:1449502768023863349>";
            case "oxide": return "<:oxide:1449502727255228577>";
            case "carbide": return "<:carbide:1449502856821346314>";
            case "fissile-matter": return "<:fissile_matter:1449502824147845354>";
            case "dormant-cyst": return "<:dormant_cyst:1449502789184000030>";
            default: return null;
        }
    }
}