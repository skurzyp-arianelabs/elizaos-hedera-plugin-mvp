import {
  Action,
  ActionResult,
  composePromptFromState,
  HandlerCallback,
  IAgentRuntime,
  logger,
  Memory,
  ModelType,
  parseJSONObjectFromText,
  State
} from "@elizaos/core";
import console from "node:console";
import { extractionTemplate } from "./create-ft-template.ts";
import { generateResponse, universalFixParsedParams } from "../utils/utils.ts";
import { HederaService } from "../service";

export const createTokenAction: Action = {
  name: "CREATE_FUNGIBLE_TOKEN_TOOL",
  description: "Create a new fungible token on the Hedera network",
  handler: async (
    runtime: IAgentRuntime,
    _message: Memory,
    state: State | undefined,
    _options: any,
    callback?: HandlerCallback
  ): Promise<ActionResult> => {
    logger.log(`Running hedera's CREATE_FUNGIBLE_TOKEN_TOOL handler...`);

    const hederaService = runtime.getService<HederaService>('hedera-service');
    if (!hederaService) {
      throw new Error('Hedera service not found');
    }

    const tool = hederaService.getTool("CREATE_FUNGIBLE_TOKEN_TOOL");
    const client = hederaService.getClient();
    const context = hederaService.getConfiguration().context;

    if (!state) {
      throw new Error('State is undefined');
    }

    const prompt = composePromptFromState({
      state,
      template: extractionTemplate,
    });

    const modelOutput = await runtime.useModel(ModelType.TEXT_LARGE, {prompt});
    console.log(`modelOutput: ${modelOutput}`);

    const parsedParams = parseJSONObjectFromText(modelOutput);
    console.log('parsedParams (raw)', parsedParams);

    const fixedParsedParams = universalFixParsedParams(parsedParams, tool.parameters);
    console.log('FIXED parsedParams', JSON.stringify(fixedParsedParams, null, 2));

    const validation = tool.parameters.safeParse(fixedParsedParams); // parsing extracted params before calling a tool
    console.log('validation:' + JSON.stringify(validation, null, 2));

    if (!validation.success) {
      if (callback) {
        callback({
          text: 'Invalid or incomplete parameters.',
          content: {error: validation.error.format()},
        });
      }
      return {success: false, error: validation.error.toString()};
    }

    try {
      const result = await tool.execute(client, context, validation.data);
      const responseText = await generateResponse(result, 'CREATE_FUNGIBLE_TOKEN_TOOL', runtime);

      if (callback) {
        callback({
          text: responseText,
          content: result,
        });
      }

      return {success: true, text: responseText};
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Error running tool ${tool.method}:`, err);

      if (callback) {
        callback({
          text: `Execution failed: ${message}`,
          content: {error: message},
        });
      }

      return {success: false, text: `Execution failed: ${message}`, error: message};
    }
  },
  validate: async (runtime) => {
    const hederaService = runtime.getService<HederaService>('hedera-service');
    return !!hederaService;
  },
  examples: [
    [
      {
        name: "{{user}}",
        content: {
          text: "Create new token with name MyToken with symbol MTK, 8 decimals and 1000 initial supply.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
      {
        name: "{{assistant}}",
        content: {
          text: "I'll create a new HTS token for you with the specified parameters.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
    ],
    [
      {
        name: "{{user}}",
        content: {
          text: "Create a new token named HederaDollar with ticker H$, 4 decimals, and 1000000 initial supply. I want to set the supply key so I could add more tokens later.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
      {
        name: "{{assistant}}",
        content: {
          text: "I'll create the HederaDollar token with a supply key so you can mint additional tokens later.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
    ],
    [
      {
        name: "{{user}}",
        content: {
          text: "Create token GameGold with symbol GG, 2 decimal places, and starting supply of 750000. This is the final supply, don't set a supply key.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
      {
        name: "{{assistant}}",
        content: {
          text: "I'll create the GameGold token with a fixed supply - no supply key will be set.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
    ],
    [
      {
        name: "{{user}}",
        content: {
          text: "Deploy a token named SuperToken with short code STK, 5 decimal places, and an issuance of 100000. No additional tokens will be minted.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
      {
        name: "{{assistant}}",
        content: {
          text: "I'll deploy the SuperToken with a fixed supply - no additional minting capability.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
    ],
    [
      {
        name: "{{user}}",
        content: {
          text: "Create new HTS token PixelCoin with symbol PXN, 3 decimal places, and 500 tokens minted. I want to control supply changes, so set the supply key.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
      {
        name: "{{assistant}}",
        content: {
          text: "I'll create the PixelCoin token with a supply key so you can control future supply changes.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
    ],
    [
      {
        name: "{{user}}",
        content: {
          text: "Launch a new HTS token called SkyCredits with ticker SKC, 9 decimal places, and a total supply of 25000. The supply is fixed.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
      {
        name: "{{assistant}}",
        content: {
          text: "I'll launch the SkyCredits token with a fixed supply - no future minting will be possible.",
          actions: ["HEDERA_CREATE_TOKEN"],
        },
      },
    ],
  ],
  similes: [
    "HEDERA_NEW_TOKEN",
    "HEDERA_CREATE_NEW_TOKEN",
    "HEDERA_NEW_FUNGIBLE_TOKEN",
  ],
};