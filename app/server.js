var express = require("express");
var Spotify = require('node-spotify-api');
var path = require("path");
var cors = require("cors");
var app = express();
require('dotenv').config();
var db = require("./models");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
//server
var PORT = process.env.PORT || 8080;


app.post("/api", function (req, res) {
  const artistName = req.body.artistName;
  const album = req.body.album;

  var spotify = new Spotify({
    id: '3b6b2f5b8750435aa00914af973df039',
    secret: 'c4115860357d47c4a65cfb081f4596e6'
  });

  //search by album
  spotify.search({
    type: 'album',
    query: album

  }).then(data => {
   let albumData;
    //matching album with the name of artist
    for (var i = 0; i < data.albums.items.length; i++) {
      if (data.albums.items[i].artists[0].name == artistName) {

        albumData =  data.albums.items[i];
        res.status(200);
        res.json(albumData)

      }
    }
  });
});

require("./routes/html-routes.js.js")(app);
require("./routes/api-routes.js.js")(app);



db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
