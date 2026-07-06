import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { buildServer } from './server.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, server: 'lsm-design-system-mcp' }));

// Stateless Streamable HTTP: a fresh server+transport per request (serverless-friendly).
app.post('/mcp', async (req, res) => {
  try {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: String(err) });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`lsm-design-system MCP server listening on http://localhost:${port}/mcp`);
});
