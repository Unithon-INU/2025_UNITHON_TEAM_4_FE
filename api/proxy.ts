import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * 헤더 변환 (host, content-length 제거)
 */
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

  // 쿼리 파라미터 재조합
  const paramString = Object.entries(params)
    .filter(([k, v]) => v !== undefined && v !== "" && k !== "url")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join("&");
  const backendUrl =
    decodeURIComponent(url) + (paramString ? (url.includes("?") ? "&" : "?") + paramString : "");

  console.log("[Vercel Proxy] 실제 요청하는 백엔드 URL:", backendUrl);

  // 헤더 준비 (content-length, host 제거)
  const headers = getHeaders(req.headers);

  // body 준비 (multipart는 Buffer로 전달됨. 그대로 전송!)
  let body: Buffer | string | undefined = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    // Vercel에서는 req.body가 이미 Buffer로 들어오므로, 별도 변환 없이 그대로 전달
    body = req.body;
  }

  try {
    const fetchRes = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
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
