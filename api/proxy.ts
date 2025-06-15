// /api/proxy.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

// host, content-length 등 제거
function getHeaders(headersObj: VercelRequest["headers"]): Record<string, string> {
  const headers: Record<string, string> = {};
  Object.entries(headersObj).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "host" || lowerKey === "content-length") return;
    if (typeof value === "string") headers[key] = value;
    else if (Array.isArray(value)) headers[key] = value.join(", ");
  });
  return headers;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  const headers = getHeaders(req.headers);

  // [핵심] req.body 대신 req (readable stream)를 그대로 fetch의 body에 넘기기
  // Node.js 18 이상 fetch에서 ReadableStream 지원됨 (Vercel 런타임도 지원)
  try {
    const fetchRes = await fetch(backendUrl, {
      method: req.method,
      headers,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: req.method === "GET" || req.method === "HEAD" ? undefined : (req as any),
        // @ts-expect-error: duplex is required for streaming in Node.js fetch, but not in types

      duplex: "half", // Node.js fetch에 Stream 쓰려면 반드시 duplex: "half" 필요
    });
    res.status(fetchRes.status);
    fetchRes.headers.forEach((v, k) => res.setHeader(k, v));
    const buffer = await fetchRes.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("[Vercel Proxy] fetch 요청 실패:", error);
    res.status(500).send("프록시 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
}