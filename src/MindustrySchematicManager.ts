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
}