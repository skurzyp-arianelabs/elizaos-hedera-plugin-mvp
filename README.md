# Hedera MVP v2 ElizaOS Plugin

A powerful ElizaOS plugin for integrating with the Hedera Hashgraph network, built with the official ElizaOS plugin architecture.

## Overview

This plugin enables seamless interaction with the Hedera distributed ledger technology through the ElizaOS ecosystem. It provides a user-friendly interface for common Hedera operations, leveraging the `hedera-agent-kit` for efficient blockchain interactions.

The plugin includes a single action that allows for interacting with the Hedera network through ElizaOS.

## Prerequisites

Before you begin, ensure you have the following installed:

* [ElizaOS CLI](https://docs.elizaos.ai/cli/installation) (latest version)
* [Bun](https://bun.sh/) package manager
* A Hedera account (for TestNet or MainNet)

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd plugin-hedera-mvp
```

### Install dependencies

```bash
bun install
```

### Environment Setup

Create a `.env` file based on the provided example:

```bash
cp .env.example .env
```

Edit the `.env` file to include your credentials:

```
OPENAI_API_KEY=your_openai_api_key
HEDERA_PRIVATE_KEY=your_hedera_private_key
HEDERA_ACCOUNT_ID=your_hedera_account_id
```

## Development

Before starting the development server, make sure your environment is properly configured:

1. Set up your environment variables in `.env`
2. Build the linked `hedera-agent-kit` package if using Option 1
3. Reinstall dependencies if needed

Then start the development server:

```bash
# Start development with hot-reloading (recommended)
elizaos dev

# OR start without hot-reloading
elizaos start

# Note: When using 'start', you need to rebuild after changes:
bun run build
```

### Link `hedera-agent-kit` (Option 1)

To use the adapter plugin approach, link the `hedera-agent-kit` package locally:

```bash
# Clone the repository
git clone https://github.com/hashgraph/hedera-agent-kit.git
cd hedera-agent-kit

# Switch to the adapter branch
git checkout feat/elizaos-adapter

# Build the package
npm run build
```

Return to the plugin directory and reinstall dependencies:

```bash
cd path/to/plugin-hedera-mvp
rm -rf node_modules
bun install
```

> **Important**: Always rebuild and reinstall dependencies in this order when making changes to the linked `hedera-agent-kit`.

### Development Workflow Summary

1. Make changes to the `hedera-agent-kit` (if using Option 1)
2. Run `npm run build` in `hedera-agent-kit`
3. Run `rm -rf node_modules && bun install` in the plugin directory
4. Start or restart the dev server with `elizaos dev`

## Switching Between Implementations

To switch between the two available plugin implementations, edit `src/index.ts`:

```ts
// OPTION 1: Adapter Plugin with auto-mapped Hedera tools
export default adapterHederaPlugin;

// OPTION 2: Starter Plugin with manual implementation
// export default starterHederaPlugin;
```

Uncomment the implementation you want to use and comment out the other.

* **Option 1** (Adapter Plugin) requires the `feat/elizaos-adapter` branch of `hedera-agent-kit`
* **Option 2** (Starter Plugin) works with the `main` branch of `hedera-agent-kit`

After switching, restart the dev server to apply changes.

## Plugin Features

* **Hedera Integration**: Seamlessly interact with the Hedera network
* **Account Management**: Create and manage Hedera accounts
* **Token Operations**: Create, mint, transfer, and manage tokens
* **Smart Contract Integration**: Deploy and interact with smart contracts
* **Topic Messaging**: Read and manage messages from Hedera topics
* **Transaction History**: View and analyze transaction history
* **Responsive UI**: User-friendly interface built with React and Tailwind CSS

## Project Structure

```
plugin-hedera-mvp-v2/
├── src/                         # Source code
│   ├── index.ts                 # Plugin selector (Option 1 or 2)
│   ├── adapter-plugin/          # Option 1: Adapter implementation
│   │   └── plugin.ts
│   └── manual-plugin/           # Option 2: Manual implementation
│       ├── plugin.ts
│       ├── service/             # Hedera service logic
│       │   └── index.ts
│       ├── actions/             # Custom action implementations
│       │   ├── create-ft-action.ts
│       │   └── create-ft-template.ts
│       └── utils/               # Utility functions
├── scripts/                     # Helper scripts
├── dist/                        # Built plugin (auto-generated)
├── .env.example                 # Example environment file
├── package.json                 # Dependencies and plugin configuration
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite bundler config
└── tsup.config.ts               # Build config
```

## Architecture

This plugin is built around two main components:

### HederaService (Manual Option)

The `HederaService` class provides a bridge between ElizaOS and the Hedera SDK:

* Initializes a Hedera client using account credentials
* Loads and exposes Hedera tools
* Provides utility methods for action execution
* Serves as a backend provider for custom actions

### Plugin Implementations

#### Adapter Plugin (Option 1)

Auto-generates plugin actions based on `hedera-agent-kit` exports using `createTokenActions`.

* Requires the `feat/elizaos-adapter` branch
* Simplifies action registration and maintenance
* Ideal for rapid development

#### Starter Plugin (Option 2)

Manual setup to illustrate how ElizaOS plugins work at a lower level.

* Manually registers `HederaService`
* Implements custom actions (e.g., token creation)
* Suitable for advanced customization

## Troubleshooting

### Common Issues

* **Missing tools**: Ensure you're on the correct `hedera-agent-kit` branch (`feat/elizaos-adapter` for Option 1).
* **.env not working**: Double-check variable names and restart the dev server.
* **Changes to linked package not applied**: Always rebuild the linked package and reinstall dependencies.
* **Switching plugin implementation fails**: Clean your environment with `rm -rf node_modules && bun install` after switching.