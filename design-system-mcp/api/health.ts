import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleHealth } from '../src/handler.js';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  handleHealth(req, res);
}

