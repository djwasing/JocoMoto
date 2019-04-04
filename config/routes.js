
var cheerio = require("cheerio");
var Article = require("../models/Article");
var Note = require("../models/Note");
var axios = require("axios")

module.exports = function(app) {
    app.get("/", function(req, res) {
        Article.find({saved: false}, function(error, found) {
            if (error) {
                console.log(error);
            } else if (found.length === 0) {
                res.render("empty")
            } else {
  
              var hbsObject = {
                  articles: found
              };
              res.render("index", hbsObject);
  
            }
        });
    });

    // -------- scrape --------
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
          // Save these results in an object that we'll push into the results [] we defined earlier
        });

        // checking each link for duplicates, and only adding new links to the db. 
            results.forEach((element, index) => {
                console.log("line 34", element);
            
                Article.find({link: element.link}, function(err, data) {
                    if (data.length == 0) {
                        //if data.length = 0 the link does not exist because we didn't return anything
                        Article.insert(element)
                            .then(inserted => {
                                console.log(inserted, index);
                                if (index === results.length -1){
                                    res.json({message: "scrape complete"});
                                    console.log("line 43 "+index);
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                    }else{
                        if (index === results.length - 1){
                            res.json({message: "There were no new articles to scrape"});
                        }
                    }
                })
            });
       })
    })

        // --------- show all ----------

    app.get("/all", function(req, res) {
        Article.find({}, function(err, data) {
          if (err) {
            console.log(err);
          }else{
            console.log(data);
            res.json(data);
          }
        });
      })
  
  // -------- Routes for Note Taking --------

  app.post("/submit", function(req, res) {
    console.log(req.body);
    //Insert the note into the notes collection
    Note.insert(req.body, function(error, saved) {
        //when user clicks submit note, gets ID from the article, and pushes newly created note ID into the Article.note
        Article.updateOne({_id: id}, {$push: {note: saved._id}})
            .then(updatedArticle => {
                res.json(updatedArticle);
            }).catch(err => {
                console.log(err);
            })
    });
    //make sure submit butn grabs the ID of the article. send the content of the note AND the ID of the article it belongs to. 
    // create var
  });
}