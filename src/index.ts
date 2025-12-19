import { DatabaseManager } from "./Initialization/Database";
import { Loader } from "./Initialization/Loader";
import { MindustryCommunityServers } from "./Initialization/MindustryCommunityServers";

async function start() {
    // Primeiro o banco, sempre!
    await DatabaseManager.connect();
    
    // Depois o resto
    MindustryCommunityServers.initialize();
    Loader.load();
}

start();