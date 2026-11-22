/* POST /api/upload?topic=N&name=fayl.pdf  — body: fayl baytlari (faqat o‘qituvchi).
 * Vercel funksiyasi so‘rov hajmi chegarasi ~4,5 MB. */
const { put } = require("@vercel/blob");
const L = require("./_lib");
module.exports = async (req, res) => {
  if (req.method !== "POST") return L.json(res, 405, { error: "method" });
  const u = L.getUser(req);
  if (!u || u.role !== "teacher") return L.json(res, 403, { error: "teacher_only" });
  try {
    await L.ensure();
    const topic = parseInt(req.query.topic, 10);
    const name = String(req.query.name || "fayl").slice(0, 200);
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const buf = Buffer.concat(chunks);
    if (!buf.length) return L.json(res, 400, { error: "empty" });
    const type = req.headers["content-type"] || "application/octet-stream";
    const safe = name.replace(/[^\w.\-]+/g, "_");
    const blob = await put(`lessons/t${topic}/${Date.now()}-${safe}`, buf, { access: "public", contentType: type });
    const r = await L.db().query(
      "insert into lessons (topic, name, url, size, type, uploaded_by) values ($1,$2,$3,$4,$5,$6) returning id, name, url, size, type",
      [topic, name, blob.url, buf.length, type, u.uid]);
    return L.json(res, 200, { file: r.rows[0] });
  } catch (e) {
    return L.json(res, 500, { error: "server" });
  }
};
