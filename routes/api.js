/*
 * GET /api/...
 */
exports.api = {
  current: function (req, res) {
    var obj = {
      "pizza": ["cheeth", "chicken"],
      "cyan": "nat",
      "vim > emacs": true,
      "vim > *": true,
      "tuesday": "belgium",
      "this isn't funny": "and neither are you"
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(obj));
    res.end();
  },

  nocurrent: function (req, res) {
    var obj;
    if (Math.random() > 0.1) {
      obj = {
        "bro": "do you even HTTP?"
      }

      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify(obj));
    } else {
      obj = {
        "418": "I'm a teapot"
      }

      res.writeHead(418, { "Content-Type": "application/json" });
      res.write(JSON.stringify(obj));
    }
    res.end();
  }
}
