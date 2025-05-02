import express from "express";
import type { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'node:crypto';
import cors from "cors";

export function createHTTPServer(server: McpServer) {
  const app = express();
  
  // Enable CORS
  app.use(cors());
  
  // Store transports by session ID
  const transports: Record<string, StreamableHTTPServerTransport | SSEServerTransport> = {};
  
  //=============================================================================
  // STREAMABLE HTTP TRANSPORT (PROTOCOL VERSION 2025-03-26)
  //=============================================================================
  
  // Apply JSON parsing middleware only to the MCP endpoint
  app.use('/mcp', express.json());
  
  // Handle all MCP Streamable HTTP requests (GET, POST, DELETE) on a single endpoint
  app.all('/mcp', async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request to /mcp`);

    try {
      // Check for existing session ID
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        // Check if the transport is of the correct type
        const existingTransport = transports[sessionId];
        if (existingTransport instanceof StreamableHTTPServerTransport) {
          // Reuse existing transport
          transport = existingTransport;
        } else {
          // Transport exists but is not a StreamableHTTPServerTransport (could be SSEServerTransport)
          res.status(400).json({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Bad Request: Session exists but uses a different transport protocol',
            },
            id: null,
          });
          return;
        }
      } else if (!sessionId && req.method === 'POST' && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sessionId) => {
            // Store the transport by session ID when session is initialized
            console.log(`StreamableHTTP session initialized with ID: ${sessionId}`);
            transports[sessionId] = transport;
          }
        });

        // Set up onclose handler to clean up transport when closed
        transport.onclose = () => {
          const sid = transport.sessionId;
          if (sid && transports[sid]) {
            console.log(`Transport closed for session ${sid}, removing from transports map`);
            delete transports[sid];
          }
        };

        // Connect the transport to the MCP server
        await server.connect(transport);
      } else {
        // Invalid request - no session ID or not initialization request
        res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: No valid session ID provided',
          },
          id: null,
        });
        return;
      }

      // Handle the request with the transport
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  });

  // Legacy SSE endpoint for older clients
  app.get("/sse", async (_, res) => {
    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
  
    // Flush headers
    res.flushHeaders?.();
  
    // Initialize transport
    const transport = new SSEServerTransport('/messages', res);
    transports[transport.sessionId] = transport;
  
    // Keep-alive mechanism
    const keepAliveInterval = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 1500);
  
    // Cleanup on client disconnect
    res.on("close", () => {
      clearInterval(keepAliveInterval);
      delete transports[transport.sessionId];
    });
  
    // Connect the transport
    await server.connect(transport);
  });

  // Legacy message endpoint for older clients
  app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (transport && transport instanceof SSEServerTransport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.status(400).send('No transport found for sessionId');
    }
  });

  return app;
} 