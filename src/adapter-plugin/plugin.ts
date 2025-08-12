import type { Plugin } from '@elizaos/core';
import { logger } from '@elizaos/core';
import { z } from 'zod';
import {
  AgentMode,
  coreAccountPlugin,
  coreConsensusPlugin,
  coreHTSPlugin,
  coreQueriesPlugin,
  ElizaOSAdapter,
  ToolDiscovery
} from "hedera-agent-kit";
import { Client } from '@hashgraph/sdk';
import { HederaAccountDetails } from "./provider/hederaAccountDetails.ts";

const configSchema = z.object({
  HEDERA_PRIVATE_KEY: z.string(),
  HEDERA_ACCOUNT_ID: z.string(),
});

const adapterHederaPlugin: Plugin = {
  name: 'plugin-hedera-mvp',
  description: 'Plugin for elizaOS interactions with Hedera',
  config: {
    HEDERA_PRIVATE_KEY: process.env.HEDERA_PRIVATE_KEY,
    HEDERA_ACCOUNT_ID: process.env.HEDERA_ACCOUNT_ID,
  },

  async init(config: Record<string, string>, runtime) {
    logger.debug('Plugin initialized');
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }

      // Initialize Hedera client
      const client = Client.forTestnet().setOperator(
        runtime.getSetting("HEDERA_ACCOUNT_ID"),
        runtime.getSetting("HEDERA_PRIVATE_KEY"),
      );

      // Initialize configuration
      const configuration = {
        plugins: [
          coreHTSPlugin,
          coreQueriesPlugin,
          coreAccountPlugin,
          coreConsensusPlugin,
        ],
        context: {
          mode: AgentMode.AUTONOMOUS,
        },
      };

      // Initialize and register provider
      runtime.registerProvider(HederaAccountDetails);

      // Initialize tools
      const toolDiscovery = ToolDiscovery.createFromConfiguration(configuration);
      const tools = toolDiscovery.getAllTools(configuration.context, configuration);

      // Create the adapter and get actions
      const adapter = new ElizaOSAdapter(client, configuration.context, tools);

      // Register the actions in the runtime
      const actions = adapter.getActions();
      if (Array.isArray(actions)) {
        actions.forEach(action => runtime.registerAction(action));
      } else {
        runtime.registerAction(actions);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid plugin configuration: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw error;
    }
  },
  actions: [], // actions are registered in the plugin init()
  providers: [],
  evaluators: [],
  services: [],
  routes: [],
  events: {},
};

export default adapterHederaPlugin;