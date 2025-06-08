import type { VercelRequest, VercelResponse } from '@vercel/node';

// fetch의 headers는 Record<string, string> 또는 Headers 객체만 허용
function getHeaders(headersObj: VercelRequest['headers']): Record<string, string> {
  const headers: Record<string, string> = {};
  Object.entries(headersObj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      headers[key] = value;
    }
    // 배열일 경우 (e.g. set-cookie) → 여러 값을 콤마로 합침
    else if (Array.isArray(value)) {
      headers[key] = value.join(', ');
    }
  });
  // host 헤더는 백엔드에 넘기지 않음
  delete headers.host;
  return headers;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url as string;
  if (!url) {
    res.status(400).send('Missing target URL');
    return;
  }

  // body는 GET/HEAD 아닐 때만
  let body: string | undefined = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  // 헤더 변환
  const headers = getHeaders(req.headers);

  // fetch 옵션 구성
  const fetchRes = await fetch(decodeURIComponent(url), {
    method: req.method,
    headers,
    body,
  });

  // 응답 전달 (JSON일 수도 있으니 Content-Type 맞게 전달)
  res.status(fetchRes.status);
  fetchRes.headers.forEach((v, k) => res.setHeader(k, v));
  const buffer = await fetchRes.arrayBuffer();
  res.send(Buffer.from(buffer));
}
