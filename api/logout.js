const L = require("./_lib");
module.exports = async (req, res) => {
  L.clearSession(res);
  return L.json(res, 200, { ok: true });
};
