
var cheerio = require("cheerio");
var Article = require("../models/Article");
var axios = require("axios");


module.exports = function(app) {

    // scrape
app.get("/scrape", function(req, res) {
    axios.get("http://www.bikeexif.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    var results = [];
  
    $("article").each(function(i, element) {
  
      var title = $(element).children("h2").children("a").text();
      var link = $(element).find("a").attr("href");
  
      if (title && link) {
        results.push({
            title: title,
            link: link
          });
      }
      // Save these results in an object that we'll push into the results array we defined earlier
      
    });

    Article.create(
        results
      )
      .then(inserted => {
        console.log(inserted);

      }).catch(err => {
          console.log(err);
      })
  })
})
    
    // --------- show all ----------

app.get("/all", function(req, res) {
    db.scrapedData.find({}, function(err, data) {
      if (err) {
        console.log(err);
      }else{
        console.log(data);
        res.json(data);
      }
    });
  })
}