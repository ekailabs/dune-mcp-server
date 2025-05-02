import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export function createStdioServer(server: McpServer) {

  const transport = new StdioServerTransport();
  server.connect(transport);
}