# Hedera MVP v2 ElizaOS Plugin

A powerful ElizaOS plugin for integrating with the Hedera Hashgraph network, built with the official ElizaOS plugin architecture.

## Overview

This plugin enables seamless interaction with the Hedera distributed ledger technology through the ElizaOS ecosystem. It provides a user-friendly interface for common Hedera operations, leveraging the hedera-agent-kit for efficient blockchain interactions.

The plugin includes a single action that allows for interacting with the Hedera network through ElizaOS.

## Prerequisites

Before you begin, ensure you have the following installed:

- [ElizaOS CLI](https://docs.elizaos.ai/cli/installation) (latest version)
- [Bun](https://bun.sh/) package manager
- A Hedera account (for TestNet or MainNet)

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

```bash
# Start development with hot-reloading (recommended)
elizaos dev

# OR start without hot-reloading
elizaos start
# Note: When using 'start', you need to rebuild after changes:
# bun run build
```

## Plugin Features

- **Hedera Integration**: Seamlessly interact with the Hedera network
- **Account Management**: Create and manage Hedera accounts
- **Token Operations**: Create, transfer, and manage tokens
- **Smart Contract Integration**: Deploy and interact with smart contracts
- **Transaction History**: View and analyze transaction history
- **Responsive UI**: User-friendly interface built with React and Tailwind CSS

## Project Structure

```
plugin-hedera-mvp-v2/
├── src/             # Source code
├── scripts/         # Helper scripts
├── dist/            # Built plugin (generated)
├── .env.example     # Example environment variables
├── package.json     # Dependencies and plugin configuration
├── tsconfig.json    # TypeScript configuration
├── vite.config.ts   # Vite configuration
└── tsup.config.ts   # Build configuration
```