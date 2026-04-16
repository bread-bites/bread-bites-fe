import { paraglideMiddleware } from '@paraglide/server'
import handler from '@tanstack/react-start/server-entry'
import { FastResponse } from 'srvx'
import { patchGlobalRequest } from "srvx/node";

globalThis.Response = FastResponse;
// Fix compatibility issues with Node.js Request
patchGlobalRequest();

export default {
  fetch(req: Request): Promise<Response> {
    return paraglideMiddleware(req, () => handler.fetch(req))
  },
}