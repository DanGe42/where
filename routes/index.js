var path = require('path');

exports.map = require(path.join(__dirname, "map")).map;
exports.api = require(path.join(__dirname, "api")).api;

/*
 * GET /
 */
exports.index = function (req, res) {
  res.render('index', {
    title: "Where in the world is Danger Dan?"
  });
};

exports.faq = function (req, res) {
  res.render('faq', {
    title: "Frequently asked questions"
  });
}
