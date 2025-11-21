const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081';

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export async function jget(path) {
  const res = await fetch(API_BASE + path, {
    credentials: 'include'
  });
  return handle(res);
}

export async function jpost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body || {})
  });
  return handle(res);
}
