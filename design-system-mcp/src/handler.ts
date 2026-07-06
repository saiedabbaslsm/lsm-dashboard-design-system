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
  if (req.method && !['POST', 'GET'].includes(req.method)) {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
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
