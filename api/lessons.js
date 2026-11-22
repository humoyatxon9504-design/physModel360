/* GET  /api/lessons?topic=N  — mavzu fayllari (kirgan foydalanuvchi uchun)
 * DELETE /api/lessons?id=N   — faylni o‘chirish (faqat o‘qituvchi) */
const { del } = require("@vercel/blob");
const L = require("./_lib");
module.exports = async (req, res) => {
  const u = L.getUser(req);
  if (!u) return L.json(res, 401, { error: "auth" });
  try {
    await L.ensure();
    if (req.method === "GET") {
      const topic = parseInt(req.query.topic, 10);
      const r = await L.db().query("select id, name, url, size, type from lessons where topic=$1 order by id", [topic]);
      return L.json(res, 200, { files: r.rows });
    }
    if (req.method === "DELETE") {
      if (u.role !== "teacher") return L.json(res, 403, { error: "teacher_only" });
      const r = await L.db().query("delete from lessons where id=$1 returning url", [parseInt(req.query.id, 10)]);
      if (r.rows[0]) await del(r.rows[0].url);
      return L.json(res, 200, { ok: true });
    }
    return L.json(res, 405, { error: "method" });
  } catch (e) {
    return L.json(res, 500, { error: "server" });
  }
};
