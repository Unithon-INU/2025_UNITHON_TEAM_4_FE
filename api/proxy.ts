// /api/proxy.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * 헤더 객체를 string key-value로 변환, host 제거
 */
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
  // 1. 쿼리 파라미터 조립
  const { url, ...params } = req.query;
  if (!url || typeof url !== "string") {
    res.status(400).send("Missing target URL");
    return;
  }
  const paramString = Object.entries(params)
    .filter(([k, v]) => v !== undefined && v !== "" && k !== "url")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join("&");
  const backendUrl =
    decodeURIComponent(url) + (paramString ? (url.includes("?") ? "&" : "?") + paramString : "");

  // 2. 헤더, body 조립
  const headers = getHeaders(req.headers);

  // **bodyParser: false 일 때 req.body는 Buffer/raw**
  let body = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = req.body;
  }

  // 3. 백엔드로 요청 전달
  const fetchRes = await fetch(backendUrl, {
    method: req.method,
    headers,
    body,
  });

  // 4. 응답 전송
  res.status(fetchRes.status);
  fetchRes.headers.forEach((v, k) => res.setHeader(k, v));
  const buffer = await fetchRes.arrayBuffer();
  res.send(Buffer.from(buffer));
}
