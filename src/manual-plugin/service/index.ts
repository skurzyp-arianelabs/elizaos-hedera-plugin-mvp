import { Configuration, Tool } from "hedera-agent-kit";
import { IAgentRuntime, Service } from "@elizaos/core";
import { coreHTSPlugin, coreQueriesPlugin, coreAccountPlugin } from "hedera-agent-kit";
import { AgentMode, ToolDiscovery } from "hedera-agent-kit";
import { Client } from "@hashgraph/sdk";

export class HederaService extends Service {
  static serviceType = 'hedera-service';
  capabilityDescription = 'Provides Hedera functionality and interactions';

  private client: Client;
  private configuration: Configuration;
  private tools: Tool[];

  constructor(runtime: IAgentRuntime) {
    super(runtime);
  }

  static async start(runtime: IAgentRuntime): Promise<HederaService> {
    const service = new HederaService(runtime);

    // Initialize Hedera client in the service
    service.client = Client.forTestnet().setOperator(
      runtime.getSetting("HEDERA_ACCOUNT_ID"),
      runtime.getSetting("HEDERA_PRIVATE_KEY"),
    );

    // Initialize configuration
    service.configuration = {
      plugins: [
        coreHTSPlugin,
        coreQueriesPlugin,
        coreAccountPlugin,
      ],
      context: {
        mode: AgentMode.AUTONOMOUS,
      },
    };

    // Initialize tools
    service.tools = ToolDiscovery.createFromConfiguration(service.configuration)
      .getAllTools(service.configuration.context, service.configuration);

    return service;
  }

  async stop(): Promise<void> {
    // Cleanup if needed
  }

  getTool(toolName: string): Tool | undefined {
    return this.tools.find(tool => tool.method.toUpperCase() === toolName);
  }

  getTools(): Tool[] {
    return this.tools;
  }

  getConfiguration(): Configuration {
    return this.configuration;
  }

  getClient(): Client {
    return this.client;
  }
}
