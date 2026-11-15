export async function onRequestGet({ request, env }) {
  if (!env.ADMIN_KEY) return Response.json({ error: 'Admin key is not configured' }, { status: 503 });
  const supplied = request.headers.get('X-Admin-Key') || '';
  if (supplied.length !== env.ADMIN_KEY.length || !timingSafeEqual(supplied, env.ADMIN_KEY)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 503 });
  try {
    const { results } = await env.DB.prepare('SELECT answer, place, jalali_date, time, phone, source, created_at FROM responses ORDER BY created_at DESC LIMIT 500').all();
    return Response.json({ responses: results }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Could not load responses. Check that the updated schema is applied.' }, { status: 500 });
  }
}
function timingSafeEqual(a, b) { let diff = 0; for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i); return diff === 0; }
