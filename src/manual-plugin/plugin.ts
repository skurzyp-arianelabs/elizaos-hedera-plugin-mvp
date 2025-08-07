import type {
  Plugin,
} from '@elizaos/core';
import { logger } from '@elizaos/core';
import { z } from 'zod';
import { HederaService } from "./service";
import { createTokenAction } from "./actions/create-ft-action.ts";

/**
 * Defines the configuration schema for a plugin, including the validation rules for the plugin name.
 *
 * @type {import('zod').ZodObject<{ EXAMPLE_PLUGIN_VARIABLE: import('zod').ZodString }>}
 */
const configSchema = z.object({
  HEDERA_PRIVATE_KEY: z.string(),
  HEDERA_ACCOUNT_ID: z.string(),
});

export const starterHederaPlugin: Plugin = {
  name: 'plugin-hedera-mvp',
  description: 'Plugin for elizaOS interactions with Hedera',
  config: {
    HEDERA_PRIVATE_KEY: process.env.HEDERA_PRIVATE_KEY,
    HEDERA_ACCOUNT_ID: process.env.HEDERA_ACCOUNT_ID,
  },
  async init(config: Record<string, string>) {
    logger.debug('Plugin initialized');
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
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
  actions: [createTokenAction],
  providers: [],
  evaluators: [],
  services: [HederaService],
  routes: [],
  events: {},
};

export default starterHederaPlugin;