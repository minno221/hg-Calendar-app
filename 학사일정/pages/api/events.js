// pages/api/events.js 위치에 넣어주세요.
import { kv } from '@vercel/kv';

const KEY = 'events';
const ADMIN_PASSWORD = '3587';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 학사일정 조회 - 누구나 가능 (비밀번호 불필요)
    const list = (await kv.get(KEY)) || [];
    return res.status(200).json(list);
  }

  if (req.method === 'POST') {
    // 일정 추가 - 관리자만
    const { password, date, name, type } = req.body;
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' });
    }
    if (!date || !name || !type) {
      return res.status(400).json({ error: '날짜, 일정명, 분류를 모두 입력해 주세요.' });
    }
    const list = (await kv.get(KEY)) || [];
    const entry = {
      id: Date.now().toString(),
      date,
      name: name.trim(),
      type, // 'event' | 'exam' | 'break'
    };
    list.push(entry);
    await kv.set(KEY, list);
    return res.status(201).json({ ok: true, entry });
  }

  if (req.method === 'DELETE') {
    // 일정 삭제 - 관리자만
    const { password, id } = req.body;
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' });
    }
    const list = (await kv.get(KEY)) || [];
    const next = list.filter((item) => item.id !== id);
    await kv.set(KEY, next);
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end('Method Not Allowed');
}
