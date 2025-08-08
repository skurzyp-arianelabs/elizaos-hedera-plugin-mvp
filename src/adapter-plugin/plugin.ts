import type { Plugin } from '@elizaos/core';
import { logger } from '@elizaos/core';
import { z } from 'zod';
import { createTokenActions } from "hedera-agent-kit";

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

      // Register actions with runtime after initialization
      const tokenActions = createTokenActions(runtime);
      if (Array.isArray(tokenActions)) {
        tokenActions.forEach(action => runtime.registerAction(action));
      } else {
        runtime.registerAction(tokenActions);
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

  // Leave actions empty initially - they'll be registered in init()
  actions: [],
  providers: [],
  evaluators: [],
  services: [],
  routes: [],
  events: {},
};

export default adapterHederaPlugin;