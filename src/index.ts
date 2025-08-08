import starterHederaPlugin from "./manual-plugin/plugin.ts";
import adapterHederaPlugin from "./adapter-plugin/plugin.ts";

/**
 * Hedera Plugin Configuration
 *
 * This project provides two implementation approaches for Hedera integration:
 *
 * 1. ADAPTER PLUGIN (Default)
 *    Uses hedera-agent-kit to automatically map all Hedera tools to elizaOS actions.
 *    Tools are registered dynamically during plugin initialization.
 *
 * 2. STARTER PLUGIN (Alternative)
 *    Provides a single example action implementation with manual parameter extraction.
 *    Uses HederaService to interact with the Hedera network.
 *    More verbose but offers finer control over implementation details.
 *
 * To switch between implementations, uncomment one export and comment out the other.
 */

// OPTION 1: Adapter Plugin with auto-mapped Hedera tools
export default adapterHederaPlugin;

// OPTION 2: Starter Plugin with manual implementation
// export default starterHederaPlugin;