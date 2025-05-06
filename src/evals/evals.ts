//evals.ts

import { EvalConfig } from 'mcp-evals';
import { openai } from "@ai-sdk/openai";
import { grade, EvalFunction } from "mcp-evals";

const get_dex_pair_metrics: EvalFunction = {
    name: "get_dex_pair_metrics Tool Evaluation",
    description: "Evaluates the get_dex_pair_metrics tool functionality",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Retrieve the DEX metrics for the ETH/USDC token pair on Ethereum");
        return JSON.parse(result);
    }
};

const get_token_pairs_liquidityEval: EvalFunction = {
    name: 'get_token_pairs_liquidity Evaluation',
    description: 'Evaluates the process of identifying the token pair with the highest USD liquidity on a given chain',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Which token pair has the highest USD liquidity on the BSC chain?");
        return JSON.parse(result);
    }
};

const get_svm_token_balancesEval: EvalFunction = {
    name: 'get_svm_token_balances Tool Evaluation',
    description: 'Evaluates retrieving token balances from a Solana wallet address',
    run: async () => {
        const result = await grade(openai("gpt-4"), "What are the token balances for the Solana wallet address 8b5TqHqh8B8qSoS6LnvarTRbTT6JBBNpf7voNsZX5Eiu?");
        return JSON.parse(result);
    }
};

const get_eigenlayer_avs_metricsEval: EvalFunction = {
  name: "get_eigenlayer_avs_metrics Evaluation",
  description: "Evaluates the correctness of the get_eigenlayer_avs_metrics tool by asking about a specific AVS's stats",
  run: async () => {
    const result = await grade(openai("gpt-4"), "Retrieve the metrics for the AVS named 'exampleAvs' using the get_eigenlayer_avs_metrics tool.");
    return JSON.parse(result);
  }
};

const get_eigenlayer_operator_metricsEval: EvalFunction = {
    name: 'Get Eigenlayer Operator Metrics Tool Evaluation',
    description: 'Evaluates the retrieval of operator statistics for a specified AVS',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please provide the operator metrics for the AVS named 'TestAVS'.");
        return JSON.parse(result);
    }
};

const config: EvalConfig = {
    model: openai("gpt-4"),
    evals: [get_dex_pair_metrics, get_token_pairs_liquidityEval, get_svm_token_balancesEval, get_eigenlayer_avs_metricsEval, get_eigenlayer_operator_metricsEval]
};
  
export default config;
  
export const evals = [get_dex_pair_metrics, get_token_pairs_liquidityEval, get_svm_token_balancesEval, get_eigenlayer_avs_metricsEval, get_eigenlayer_operator_metricsEval];