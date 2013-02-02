var path = require('path');

var config = require(path.join(__dirname, "..", "config")),
    fsq = require(path.join(__dirname, "..", "lib", "fsq"));

var publicFolder = path.join(__dirname, "..", "public");

var extractFsqData = function(fsqData) {
  var checkins = fsqData.response.checkins;
  if (checkins.items.length < 1) {
    console.error("The impossible has occurred");
    throw "Impossible condition";
  }

  // TODO: handle private checkins
  return checkins.items[0];
}

var condenseFsqData = function (checkin) {
  return {
    id: checkin.id,
    createdAt: checkin.createdAt,
    timeZoneOffset: checkin.timeZoneOffset,
    venue: {
      name: checkin.venue.name,
      location: checkin.venue.location,
      url: checkin.venue.canonicalUrl
    }
  };
}

/*
 * GET home page.
 */
exports.index = function(req, res){
  var token = config.FSQ_OAUTH_TOKEN;
  fsq.mostRecentCheckin(token, function(resp) {
    if (resp.statusCode != 200) {
      console.error(resp.statusCode);
      console.error(resp.headers);
      res.status(500).sendfile(path.join(publicFolder, "500.html"));
      return;
    }

    resp.on('data', function(d) {
      try {
        var json = JSON.parse(d);
        var checkin = condenseFsqData(extractFsqData(json));
        res.render('index', {
          title: 'Where in the world...',
          api_key: config.GMAPS_API_KEY,
          checkin: checkin
        });
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.error("Parsing JSON failed!");
          //res.writeHead(500, { "Content-Type": "text/html" });
          res.status(500).sendfile(path.join(publicFolder, "bad_data.html"));
        } else {
          res.status(500).sendfile(path.join(publicFolder, "500.html"));
        }
      }
    });
  }, function (err) {
    console.error(err);
    res.send(500, "Something went wrong with my connection!");
  });
};