import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleMcpRequest } from '../src/handler.js';

export const config = {
  maxDuration: 300,
};

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
  await handleMcpRequest(req, res);
}

