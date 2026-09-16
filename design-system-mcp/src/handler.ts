import type { IncomingMessage, ServerResponse } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { buildServer } from './server.js';

export type JsonResponse = ServerResponse & {
  status?: (code: number) => JsonResponse;
  json?: (body: unknown) => void;
};

function sendJson(res: JsonResponse, status: number, body: unknown) {
  const setStatus = res.status;
  const sendBody = res.json;

  if (typeof setStatus === 'function' && typeof sendBody === 'function') {
    setStatus.call(res, status).json?.(body);
    return;
  }

  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
}

export async function handleMcpRequest(
  req: IncomingMessage & { body?: unknown },
  res: JsonResponse,
  parsedBody?: unknown
) {
  // POST only. A GET opens a standalone SSE stream for server->client
  // notifications and holds the function open until maxDuration — this server
  // never sends notifications (content is read fresh per request), so the
  // stream did nothing but burn ~2GB x 300s per connected client. The spec
  // explicitly permits 405 here; clients fall back to POST-only.
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed — this MCP endpoint is POST-only (no SSE stream)' });
    return;
  }

  try {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      // Plain JSON responses: every tool here is single-response, so an SSE
      // envelope only adds bytes and keeps the response open longer.
      enableJsonResponse: true,
    });
    res.on('close', () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, parsedBody ?? req.body);
  } catch (err) {
    if (!res.headersSent) sendJson(res, 500, { error: String(err) });
  }
}

export function handleHealth(_req: IncomingMessage, res: JsonResponse) {
  sendJson(res, 200, { ok: true, server: 'lsm-design-system-mcp' });
}
