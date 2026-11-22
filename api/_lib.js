/* Umumiy yordamchilar: ma’lumotlar bazasi, parol xeshi, sessiya (imzolangan cookie). */
const crypto = require("crypto");
const { Pool } = require("pg");

let pool = null;
function db() {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}

let ready = null;
function ensure() {
  if (!ready) {
    ready = db().query(`
      create table if not exists users (
        id serial primary key,
        username text unique not null,
        password text not null,
        role text not null,
        full_name text default '',
        created_at timestamptz default now()
      );
      create table if not exists lessons (
        id serial primary key,
        topic int not null,
        name text not null,
        url text not null,
        size int default 0,
        type text default '',
        uploaded_by int references users(id),
        created_at timestamptz default now()
      );`).catch(e => { ready = null; throw e; });
  }
  return ready;
}

function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt + ":" + crypto.scryptSync(pw, salt, 64).toString("hex");
}
function checkPassword(pw, stored) {
  const [salt, h] = String(stored).split(":");
  const t = crypto.scryptSync(pw, salt, 64);
  const a = Buffer.from(h, "hex");
  return a.length === t.length && crypto.timingSafeEqual(a, t);
}

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET sozlanmagan (kamida 16 belgi)");
  return s;
}
const DAY = 7 * 24 * 3600 * 1000;
function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return body + "." + sig;
}
function verify(token) {
  if (!token || token.indexOf(".") < 0) return null;
  const [body, sig] = token.split(".");
  const exp = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  if (sig.length !== exp.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(exp))) return null;
  const p = JSON.parse(Buffer.from(body, "base64url").toString());
  return p.exp > Date.now() ? p : null;
}
function getUser(req) {
  const m = /(?:^|;\s*)pm_session=([^;]+)/.exec(req.headers.cookie || "");
  return m ? verify(m[1]) : null;
}
function setSession(res, u) {
  const tok = sign({ uid: u.id, role: u.role, name: u.full_name || u.username, exp: Date.now() + DAY });
  res.setHeader("Set-Cookie", `pm_session=${tok}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DAY / 1000}`);
}
function clearSession(res) {
  res.setHeader("Set-Cookie", "pm_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
}

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}
async function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let s = "";
  for await (const c of req) s += c;
  return s ? JSON.parse(s) : {};
}
const publicUser = u => ({ id: u.id, username: u.username, role: u.role, name: u.full_name || u.username });

module.exports = { db, ensure, hashPassword, checkPassword, setSession, clearSession, getUser, json, body, publicUser };
