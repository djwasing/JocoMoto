
var cheerio = require("cheerio");
var Article = require("../models/Article");
var Note = require("../models/Note");
var axios = require("axios")
var articlesController = require("../controllers/articles");

module.exports = function(app) {
    app.get("/", function(req, res) {
        Article.find({saved: false}, function(error, data) {
            //console.log(data);
            if (error) {
                console.log(error);
            } else if (data.length === 0) {
                res.render("empty")
            } else {
  
              var hbsObject = {
                  articles: data
              };
              
              res.render("index", hbsObject);
  
            }
        });
    });

    // -------- scrape ------
    app.get("/scrape", function(req, res) {
        axios.get("http://www.bikeexif.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        var results = [];
    
        $("article").each(function(i, element) {
        
          var title = $(element).children("h2").children("a").text();
          var link = $(element).find("a").attr("href");
          var summary = $(element).children("p").text();
        
          if (title && link) {
            results.push({
                title: title,
                link: link,
                summary: summary
              });
          }
          // Save these results in an object that we'll push into the results [] we defined earlier
        });

        // checking each link for duplicates, and only adding new links to the db. 
            results.forEach((element, index) => {
                //console.log("line 34", element);
            
                Article.find({link: element.link}, function(err, data) {
                    if (data.length == 0) {
                        //if data.length = 0 the link does not exist because we didn't return anything
                        Article.create(element)
                            .then(inserted => {
                                //console.log(inserted, index);
                                if (index === results.length -1){
                                    res.json({message: "scrape complete"});
                                    //console.log("line 43 "+index);
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                    }else{
                        if (index === results.length - 1){
                            res.json({message: "No new articles right now."});
                        }
                    }
                })
            });
       })
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


//  -------- Saving articles ----------

  app.patch("/api/articles", function(req, res) {

    articlesController.update(req.body, function(err, data) {
        //this gets sent back to app.js and the article is either saved or unsaved
        res.json(data);
    });
});

// ----------- go to saved page ---------

app.get("/saved", function(req, res) {

    articlesController.get({saved: true}, function(data) {
        var hbsObject = {
          articles: data
        };
        res.render("saved", hbsObject);
    });
});

app.post("/notes/:id", function(req, res) {
    var newNote = new Note(req.body);
    //save it to the DB
    newNote.save(function(err, doc) {
        if (err) {
            console.log(err);
        }
        Article.findOneAndUpdate(
            {_id: req.params.id},
            {$push: {note: doc._id}},
            {new: true},
            (err, newDoc) => {
                if (err) console.log(err);
                res.send(newDoc);
            }
        )
    })
})

}