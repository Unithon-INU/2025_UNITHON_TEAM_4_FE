// /api/proxy.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * 헤더 객체를 string key-value로 변환, host 및 content-length 제거
 */
function getHeaders(headersObj: VercelRequest["headers"]): Record<string, string> {
  const headers: Record<string, string> = {};
  Object.entries(headersObj).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase(); // 대소문자 무시를 위해 소문자로 변환

    // 'host'와 'content-length' 헤더는 프록시에서 재설정되거나 불필요하므로 제거
    if (lowerKey === "host" || lowerKey === "content-length") {
      return;
    }

    if (typeof value === "string") {
      headers[key] = value;
    } else if (Array.isArray(value)) {
      headers[key] = value.join(", ");
    }
  });
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

  console.log("[Vercel Proxy] 실제 요청하는 백엔드 URL:", backendUrl); // 디버깅용 로그 추가

  // 2. 헤더, body 조립
  const headers = getHeaders(req.headers);

  let body: VercelRequest['body'] | undefined = undefined; // 타입 명확화
  if (req.method !== "GET" && req.method !== "HEAD") {
    // Vercel에서 raw body (Buffer)를 받을 때, 이를 그대로 전달
    body = req.body;
  }

  // 3. 백엔드로 요청 전달
  try {
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
  } catch (error) {
    console.error("[Vercel Proxy] Fetch Error:", error);
    // 에러 발생 시 500 응답
    res.status(500).send("Proxy request failed. Please try again later.");
  }
}
