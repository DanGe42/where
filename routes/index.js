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

var renderMap = function (req, res, offset_lon, offset_lat) {
  var wise_guy = offset_lon === 0 && offset_lat === 0;
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
        res.render('map', {
          title: 'Where in the world...',
          api_key: config.GMAPS_API_KEY,
          offset_x: offset_lon,
          offset_y: offset_lat,
          checkin: checkin,
          wise_guy: wise_guy
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
}

var MAP_RANGE_LAT = 20.0;
var MAP_RANGE_LON = 60.0;
var MAP_OFFSET_LAT = 0;
var MAP_OFFSET_LON = -50.0;

/*
 * GET /map
 */
exports.map = function(req, res){
  // convert string param to float via type coercion
  // If this fails, returns a NaN
  var offset_lon = +(req.query.q);
  var offset_lat = +(req.query.s);

  // test for NaN
  if (!(offset_lon == offset_lon && offset_lat == offset_lat)) {
    offset_lon = Math.random() * MAP_RANGE_LON + MAP_OFFSET_LON;
    offset_lat = Math.random() * MAP_RANGE_LAT + MAP_OFFSET_LAT;

    if (offset_lon === 0) {
      offset_lon = 0.5;
    }
    if (offset_lat === 0) {
      offset_lat = 0.5;
    }
    res.redirect("/map?q=" + offset_lon + "&s=" + offset_lat);
    return;
  } else {
    renderMap(req, res, offset_lon, offset_lat);
  }
};

/*
 * GET /
 */
exports.index = function (req, res) {
  res.render('index', {
    title: "Where in the world is Danger Dan?"
  });
};

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
