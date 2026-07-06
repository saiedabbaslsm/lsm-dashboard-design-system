import express from 'express';
import { handleHealth, handleMcpRequest } from './handler.js';

const app = express();
app.use(express.json());

app.get('/health', handleHealth);

// Stateless Streamable HTTP: a fresh server+transport per request (serverless-friendly).
app.post('/mcp', (req, res) => handleMcpRequest(req, res, req.body));

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`lsm-design-system MCP server listening on http://localhost:${port}/mcp`);
});
