import axios from 'axios';

const BASE_URL = 'https://api.dune.com/api/echo/beta/balances/svm/';
const PAGE_SIZE = 100; // Maximum rows per page

interface TokenBalance {
  amount: string;
  price_usd: number;
  symbol: string;
  name: string;
}

// Global API key handling
function getApiKey(): string {
  const apiKey = process.env.DUNE_API_KEY;
  if (!apiKey) throw new Error("Missing DUNE_API_KEY");
  return apiKey;
}

const duneClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Dune-API-Key': getApiKey()
  }
});

async function fetchAllPages(endpoint: string, params: any = {}) {
  let allRows: any[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await duneClient.get(endpoint, {
      params: {
        ...params,
        limit: PAGE_SIZE,
        offset: offset
      }
    });

    const rows = response.data.result.rows;
    allRows = allRows.concat(rows);
    
    // Check if we got fewer rows than requested, meaning we're at the end
    hasMore = rows.length === PAGE_SIZE;
    offset += PAGE_SIZE;
  }

  return allRows;
}
        
export async function fetchSVMTokenBalance(address: string): Promise<TokenBalance[]> {
  const response = await duneClient.get(address, {
    params: {
      chains: 'solana'
    }
  });
  const resultsArray = response.data.balances.map((balance: any) => ({
    amount: balance.amount,
    price_usd: balance.price_usd,
    symbol: balance.symbol,
    name: balance.name
  }));

  return resultsArray;
}