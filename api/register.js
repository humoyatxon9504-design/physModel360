const L = require("./_lib");
module.exports = async (req, res) => {
  if (req.method !== "POST") return L.json(res, 405, { error: "method" });
  try {
    await L.ensure();
    const b = await L.body(req);
    const username = String(b.username || "").trim().toLowerCase();
    const password = String(b.password || "");
    const full = String(b.full_name || "").trim().slice(0, 100);
    const role = b.role === "teacher" ? "teacher" : "student";
    if (!/^[a-z0-9_]{3,20}$/.test(username)) return L.json(res, 400, { error: "username" });
    if (password.length < 6) return L.json(res, 400, { error: "password" });
    if (role === "teacher" && (!process.env.TEACHER_CODE || b.teacher_code !== process.env.TEACHER_CODE))
      return L.json(res, 403, { error: "teacher_code" });
    const r = await L.db().query(
      "insert into users (username, password, role, full_name) values ($1,$2,$3,$4) returning id, username, role, full_name",
      [username, L.hashPassword(password), role, full]);
    L.setSession(res, r.rows[0]);
    return L.json(res, 200, { user: L.publicUser(r.rows[0]) });
  } catch (e) {
    if (e && e.code === "23505") return L.json(res, 409, { error: "exists" });
    return L.json(res, 500, { error: "server" });
  }
};
