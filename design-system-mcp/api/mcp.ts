import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleMcpRequest } from '../src/handler.js';

// Tool calls return in well under a second. 15s is a backstop that makes a
// held-open function impossible even if a client misbehaves; the previous 300
// let every stray connection burn 2GB for five minutes.
export const config = {
  maxDuration: 15,
};

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
  await handleMcpRequest(req, res);
}

