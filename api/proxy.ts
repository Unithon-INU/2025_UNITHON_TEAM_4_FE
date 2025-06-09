import type { VercelRequest, VercelResponse } from "@vercel/node";

function getHeaders(headersObj: VercelRequest["headers"]): Record<string, string> {
  const headers: Record<string, string> = {};
  Object.entries(headersObj).forEach(([key, value]) => {
    if (typeof value === "string") {
      headers[key] = value;
    } else if (Array.isArray(value)) {
      headers[key] = value.join(", ");
    }
  });
  delete headers.host;
  return headers;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url as string;
  if (!url) {
    res.status(400).send("Missing target URL");
    return;
  }

  // ✅ 여기에 로그 추가!
  const decodedUrl = decodeURIComponent(url);
  console.log("[Vercel Proxy] 실제 요청하는 백엔드 URL:", decodedUrl);

  let body: string | undefined = undefined;
  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  const headers = getHeaders(req.headers);

  const fetchRes = await fetch(decodedUrl, {
    method: req.method,
    headers,
    body,
  });

  res.status(fetchRes.status);
  fetchRes.headers.forEach((v, k) => res.setHeader(k, v));
  const buffer = await fetchRes.arrayBuffer();
  res.send(Buffer.from(buffer));
}
