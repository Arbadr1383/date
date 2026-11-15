export async function onRequestPost({ request, env }) {
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 503 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const allowed = new Set(['yes', 'maybe', 'no']);
  if (!allowed.has(body?.answer)) return Response.json({ error: 'Invalid answer' }, { status: 400 });
  const place = typeof body.place === 'string' ? body.place.slice(0, 80) : null;
  const jalaliDate = typeof body.jalali_date === 'string' && /^(13\d\d|14\d\d|1500)\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/.test(body.jalali_date) ? body.jalali_date : null;
  if (jalaliDate && !isJalaliDateInRange(jalaliDate)) return Response.json({ error: 'Date is in the past or too far ahead' }, { status: 400 });
  const time = typeof body.time === 'string' && /^(0\d|1\d|2[0-2]):(00|30)$/.test(body.time) ? body.time : null;
  const phoneRaw = typeof body.phone === 'string' ? body.phone.trim() : '';
  const phone = phoneRaw && /^[+0-9()\-\s]{7,24}$/.test(phoneRaw) ? phoneRaw : null;
  const source = typeof body.source === 'string' ? body.source.slice(0, 40) : 'invite-v3-pink-purple';
  if (body.answer === 'yes' && (place || body.jalali_date || body.time) && (!place || !jalaliDate || !time)) return Response.json({ error: 'Incomplete date selection' }, { status: 400 });
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString().replace('T', ' ').replace('Z', '');
  try {
    await env.DB.prepare('INSERT INTO responses (id, answer, place, jalali_date, time, phone, source, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, body.answer, place, jalaliDate, time, phone, source, createdAt).run();
    return Response.json({ ok: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Could not save response. Check that the updated schema is applied.' }, { status: 500 });
  }
}

// فقط تاریخ‌های امروز (با یک روز تلورانس برای اختلاف منطقهٔ زمانی) تا ۳۶۶ روز آینده پذیرفته می‌شوند؛ تاریخ‌های قدیمی رد می‌شوند.
function isJalaliDateInRange(str) {
  const fmt = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
  const now = Date.now();
  for (let i = -1; i <= 366; i++) {
    const p = Object.fromEntries(fmt.formatToParts(new Date(now + i * 864e5)).map(x => [x.type, x.value]));
    if (`${p.year}/${p.month}/${p.day}` === str) return true;
  }
  return false;
}
