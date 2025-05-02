import axios from 'axios';

interface DexMetrics {
  token_pair: string;
  projects: string[];
  all_time_volume: number;
  usd_liquidity: number;
  seven_day_volume_liquidity_ratio: number;
}

const BASE_URL = 'https://api.dune.com/api/v1/dex/pairs';


export async function fetchDexMetrics(chain: string, token_pair: string): Promise<DexMetrics[]> {
  const apiKey = process.env.DUNE_API_KEY;
  if (!apiKey) throw new Error("Missing DUNE_API_KEY");

  const response = await axios.get(BASE_URL + '/' + chain, {
    headers: {
      'X-Dune-API-Key': apiKey,
    },
    params: {
      token_pair: token_pair,
      columns: 'token_pair, projects, all_time_volume, usd_liquidity, seven_day_volume_liquidity_ratio'
    }
  });

  return response.data.result.rows;
}

export async function fetchTopTokenPairByChain(chain: string): Promise<DexMetrics[]> {
  const apiKey = process.env.DUNE_API_KEY;
  if (!apiKey) throw new Error("Missing DUNE_API_KEY");

  const response = await axios.get(BASE_URL + '/' + chain, {
    headers: {
      'X-Dune-API-Key': apiKey,
    },
    params: {
      columns: 'token_pair, projects, all_time_volume, usd_liquidity, seven_day_volume_liquidity_ratio',
      sort_by: 'usd_liquidity desc',
      limit:100
    }
  });

  return response.data.result.rows;
}