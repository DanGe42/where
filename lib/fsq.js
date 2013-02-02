var https  = require("https");

exports.mostRecentCheckin = function(token, onSuccess, onError) {
  var url = "https://api.foursquare.com/v2/users/self/checkins?limit=1" +
    "&sort=newestfirst&oauth_token=" + token + "&v=20130126";

  https.get(url, onSuccess).on('error', onError);
};