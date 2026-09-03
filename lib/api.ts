export function json(data: unknown, init: ResponseInit = {}) {
  return Response.json({ success: true, data }, init);
}

export function error(message: string, status = 500, details?: unknown) {
  return Response.json({ success: false, error: message, ...(details ? { details } : {}) }, { status });
}

export function getCorsHeaders() {
  const origin = process.env.FRONTEND_URL || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export function withCors(response: Response) {
  Object.entries(getCorsHeaders()).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}
