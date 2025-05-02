import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDuneTools } from "./core/tools.js";
import { createHTTPServer } from "./servers/http.js";
import { createStdioServer } from "./servers/stdio.js";

const server = new McpServer({
  name: "dune-analytics-server",
  version: "0.0.1"
});

// Register all tools
registerDuneTools(server);

// Choose which server to use based on command line argument or environment variable
const serverType = process.argv[2] || process.env.SERVER_TYPE || "http";
const port = parseInt(process.env.PORT || "3003", 10);

console.log(`Starting DUNE Analytics server in ${serverType} mode on port ${port}`);

switch (serverType) {
  case "stdio":
    createStdioServer(server);
    console.log("DUNE Analytics server running in stdio mode");
    break;
    
  case "http":
    const httpApp = createHTTPServer(server);
    httpApp.listen(port, () => {
      console.log(`DUNE Analytics server running on port ${port} using HTTP transport`);
    });
    break;
    
    
  default:
    console.error(`Unknown server type: ${serverType}`);
    console.error("Available types: stdio, http");
    process.exit(1)
    ;
    
}
// Cleanup on exit
process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});