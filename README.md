# Dune Analytics MCP Server

A Model Context Protocol (MCP) server that bridges Dune Analytics data to AI agents, providing access to DEX metrics, EigenLayer operators and AVS stats, and token balances on Solana. The tools utilize the preset endpoints and echo endpoints provided by Dune.

## Features

- **Tools**:
  - `get_dex_pair_metrics`: Get essential metadata and statistical data for a given token pair on a specific chain
  - `get_token_pairs_liquidity`: Find the token pair with the highest USD liquidity on a given chain
  - `get_svm_token_balances`: Get token balances for a specific wallet address on Solana
  - `get_eigenlayer_avs_metrics`: Get statistics for a specific AVS
  - `get_eigenlayer_operator_metrics`: Get statistics for all operators in a specific AVS
- **Data Formats**: All results are returned in structured JSON format for easy processing

## Prerequisites

- Node.js 16+ or Bun 1.0+
- A valid Dune Analytics API key (get one from [Dune Analytics](https://dune.com/settings/api))

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ekailabs/dune-mcp-server.git
   cd dune-mcp-server
   ```

2. **Install Dependencies**:
   Using Bun:
   ```bash
   bun install
   ```
   Or using npm:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the project root based on `.env.example`:
   ```
   DUNE_API_KEY=your_api_key_here
   ```
   Alternatively, set it as a system environment variable:
   ```bash
   export DUNE_API_KEY="your_api_key_here"
   ```

## Usage

### Running the Server

Using Bun:
```bash
# Development mode with hot reload
bun dev

# Production mode
bun start

# Or build and run
bun build src/index.ts --outdir dist
bun dist/index.js
```

Using npm:
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start

# Or build and run
npm run build
npm run start:prod
```

### Add to Claude for Desktop

To use with Claude for Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "dune": {
      "command": "bun",
      "args": [
        "/ABSOLUTE/PATH/TO/dune-mcp-server/src/index.ts",
        "stdio"
      ]
    }
  }
}
```


### Tool Usage

1. **`get_dex_pair_metrics(chain, token_pair)`**
   - **Description**: Retrieves essential metadata and statistical data for a given token pair
   - **Input**: 
     - `chain` (string) - The blockchain to get the DEX stats for
     - `token_pair` (string) - The token pair to get the DEX stats for
   - **Output**: JSON object containing DEX metrics

2. **`get_token_pairs_liquidity(chain)`**
   - **Description**: Identifies the token pair with the highest USD liquidity on a given chain
   - **Input**: `chain` (string) - The blockchain to get the DEX stats for
   - **Output**: JSON object containing top token pair metrics

3. **`get_svm_token_balances(wallet_address)`**
   - **Description**: Gets the balances of a specific wallet address on the Solana blockchain
   - **Input**: `wallet_address` (string) - The address of the wallet to get the balance for
   - **Output**: JSON array of token balances

4. **`get_eigenlayer_avs_metrics(avs_name)`**
   - **Description**: Gets the statistics for a specific AVS
   - **Input**: `avs_name` (string) - The name of the AVS to get the stats for
   - **Output**: JSON object containing AVS metrics

5. **`get_eigenlayer_operator_metrics(avs_name)`**
   - **Description**: Gets the statistics for all operators in a specific AVS
   - **Input**: `avs_name` (string) - The name of the AVS to get operator stats for
   - **Output**: JSON object containing operator metrics

### Example Commands in Claude for Desktop

- "Can you please give me the liquidity of 'USDC-WETH' token pair on ethereum?"
- "Show me the highest liquidity token pair on arbitrum"
- "Can you please plot the stake distribution of EigenDA operators?"
- "How many stakers are there on EigenDA AVS"

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Dune Analytics](https://dune.com/) for their API
- [Model Context Protocol](https://github.com/modelcontextprotocol) for the protocol specification