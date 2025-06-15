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
  const { url, ...params } = req.query;
  if (!url || typeof url !== "string") {
    res.status(400).send("Missing target URL");
    return;
  }

  // ✅ 쿼리 파라미터(나머지) 조립!
  const paramString = Object.entries(params)
    .filter(([k, v]) => v !== undefined && v !== "" && k !== "url")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join("&");

  // 기존 url에 이미 ? 있으면 & 붙이기
  const backendUrl =
    decodeURIComponent(url) + (paramString ? (url.includes("?") ? "&" : "?") + paramString : "");

  console.log("[Vercel Proxy] 실제 요청하는 백엔드 URL:", backendUrl);

  let body: string | undefined = undefined;
  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  const headers = getHeaders(req.headers);

  const fetchRes = await fetch(backendUrl, {
    method: req.method,
    headers,
    body,
  });

  res.status(fetchRes.status);
  fetchRes.headers.forEach((v, k) => res.setHeader(k, v));
  const buffer = await fetchRes.arrayBuffer();
  res.send(Buffer.from(buffer));
}
