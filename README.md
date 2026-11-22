# PhysModel 360 — veb sayt (Vercel)

Statik sayt + serverli qism (`api/`): ro‘yxatdan o‘tish, kirish, o‘qituvchi fayllari.

## Tuzilish
- `index.html`, `css/`, `js/` — sayt (statik)
- `api/_lib.js` — ma’lumotlar bazasi, parol xeshi (scrypt), sessiya (imzolangan cookie)
- `api/register.js`, `api/login.js`, `api/logout.js`, `api/me.js` — hisoblar
- `api/lessons.js` — mavzu fayllari ro‘yxati va o‘chirish
- `api/upload.js` — o‘qituvchi fayl yuklashi (Vercel Blob)

## O‘rnatish (bir marta)
1. Kodni GitHub ga yuklang yoki Vercel CLI bilan joylang.
2. Vercel → **Storage** → **Neon Postgres** (yoki Vercel Postgres) ulang. `DATABASE_URL` avtomatik qo‘shiladi.
3. Vercel → **Storage** → **Blob** yarating va loyihaga ulang. `BLOB_READ_WRITE_TOKEN` avtomatik qo‘shiladi.
4. Vercel → **Settings → Environment Variables**:
   - `SESSION_SECRET` — kamida 32 belgili tasodifiy matn
   - `TEACHER_CODE` — o‘qituvchilar ro‘yxatdan o‘tishi uchun maxfiy kod
5. `npm install` (Vercel o‘zi bajaradi) va deploy.

Jadvallar birinchi so‘rovda avtomatik yaratiladi.

## Hisob turlari
- **O‘quvchi:** ro‘yxatdan o‘tadi (login, parol, ism). Fayllarni ko‘radi va yuklab oladi.
- **O‘qituvchi:** ro‘yxatdan o‘tishda «O‘qituvchi» ni tanlaydi va `TEACHER_CODE` ni kiritadi. Fayl yuklaydi va o‘chiradi.

## Cheklovlar
- Bitta fayl 4 MB gacha (Vercel so‘rov chegarasi). Katta video uchun Vercel Blob’ning to‘g‘ridan-to‘g‘ri yuklash rejimi kerak.
- Fayllar ochiq havola bilan saqlanadi (havola tasodifiy, lekin maxfiy emas).
- Parol tiklash (email orqali) hozircha yo‘q.
