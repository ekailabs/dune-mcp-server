import axios from 'axios';

const BASE_URL = 'https://api.dune.com/api/v1/eigenlayer';
const PAGE_SIZE = 100; // Maximum rows per page

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

interface AvsMetrics {
  num_operators: number;
  total_TVL: number;
  num_stakers: number;
}

interface OperatorMetrics {
  operator_name: string;
  total_TVL: number;
  num_stakers: number;
}

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

export async function fetchAvsMetrics(avs_name: string): Promise<AvsMetrics[]> {
  const metrics = await fetchAllPages('/avs-stats');
  const filteredMetrics = metrics.filter((metric: any) => metric.avs_name === avs_name);
  const metricsArray = filteredMetrics.map((metric: any) => ({
    num_operators: metric.num_operators,
    total_TVL: metric.total_TVL,
    num_stakers: metric.num_stakers
  }));
  return metricsArray;
}

export async function fetchOperatorMetrics(avs_name: string): Promise<OperatorMetrics[]> {
  // First get all operators for this AVS
  const operators = await fetchAllPages('/operator-to-avs-mapping', {
    filters: "avs_name = '" + avs_name + "'"
  });
  const operatorNames = operators.map((op: any) => op.operator_name);

  // Then get all operator metrics
  const allMetrics = await fetchAllPages('/operator-stats');
  
  // Filter and map the metrics for our operators
  const avsOperatorMetrics = allMetrics
    .filter((metric: any) => operatorNames.includes(metric.operator_name))
    .map((metric: any) => ({
      operator_name: metric.operator_name,
      total_TVL: metric.total_TVL,
      num_stakers: metric.num_stakers
    }));

  return avsOperatorMetrics;
}



