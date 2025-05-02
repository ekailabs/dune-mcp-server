import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as services from "./services/index.js";

/**
 * Register all Dune-related tools with the MCP server
 * 
 * @param server The MCP server instance
 */
export function registerDuneTools(server: McpServer) {
  
  //DEX TOOLS
  server.tool(
    "get_dex_pair_metrics",
    "Given a blockchain, retrieves essential metadata and statistical data for a given token pair",
    {
      chain: z.string().describe("The chain to get the DEX stats for"),
      token_pair: z.string().describe("The token pair to get the DEX stats for")
    },
    async ({ chain, token_pair }) => {
      try {
        const metrics = await services.fetchDexMetrics(chain, token_pair);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              metrics
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error fetching metrics: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "get_token_pairs_liquidity",
    "Identify the token pair with the highest USD liquidity on a given chain",
    {
      chain: z.string().describe("The chain to get the DEX stats for"),
    },
    async ({ chain }) => {
      try {
        const metrics = await services.fetchTopTokenPairByChain(chain);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              metrics
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error fetching metrics: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );
  
  // SOLANA TOOLS
  server.tool(
    "get_svm_token_balances",
    "Get the balances of a specific wallet address on the Solana blockchain",
    {
      wallet_address: z.string().describe("The address of the wallet to get the balance for")
    },  
    async ({ wallet_address }) => {
      try {
        const metrics = await services.fetchSVMTokenBalance(wallet_address);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              metrics
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error fetching metrics: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );


  //EIGENLAYER TOOLS

  // Get AVS stats for a specific AVS
  server.tool(
    "get_eigenlayer_avs_metrics",
    "Get the stats for a specific AVS", 
    {
     avs_name: z.string().describe("The name of the AVS to get the stats for")
    },
    async ({ avs_name }) => {
      try {
        const metrics = await services.fetchAvsMetrics(avs_name);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              metrics
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error fetching metrics: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  // Get operator stats for a specific AVS
  server.tool(
    "get_eigenlayer_operator_metrics",
    "Get the stats for all operators in a specific AVS",
    {
      avs_name: z.string().describe("The name of the AVS to get operator stats for")
    },
    async ({ avs_name }) => {
      try {
        const metrics = await services.fetchOperatorMetrics(avs_name);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              avs_name,
              metrics
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error fetching operator metrics: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  
}
