const L = require("./_lib");
module.exports = async (req, res) => {
  const u = L.getUser(req);
  if (!u) return L.json(res, 401, { error: "auth" });
  return L.json(res, 200, { user: { id: u.uid, role: u.role, name: u.name } });
};
