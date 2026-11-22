const L = require("./_lib");
module.exports = async (req, res) => {
  if (req.method !== "POST") return L.json(res, 405, { error: "method" });
  try {
    await L.ensure();
    const b = await L.body(req);
    const r = await L.db().query("select id, username, password, role, full_name from users where username=$1",
      [String(b.username || "").trim().toLowerCase()]);
    const u = r.rows[0];
    if (!u || !L.checkPassword(String(b.password || ""), u.password)) return L.json(res, 401, { error: "credentials" });
    L.setSession(res, u);
    return L.json(res, 200, { user: L.publicUser(u) });
  } catch (e) {
    return L.json(res, 500, { error: "server" });
  }
};
