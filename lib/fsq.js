var https  = require("https");

exports.mostRecentCheckin = function(token, onSuccess, onError) {
  var options = {
    hostname: "api.foursquare.com",
    port: 443,
    path: "/v2/users/self/checkins?limit=1&sort=newestfirst&oauth_token=" +
      token + "&v=20130126",
    method: 'GET'
  };

  var req = https.request(options, onSuccess);
  req.end();

  req.on('error', onError);
};