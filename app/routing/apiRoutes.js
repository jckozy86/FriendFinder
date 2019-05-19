var friendsArray = require("../data/friends");
var path = require("path");

module.exports = function(app) {

  //serving a jsonArray of all friends
  app.get("/api/friends", function(req, res) {
    res.json(friendsArray);
  });

  //serving html file with survey
  app.get("/survey", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/survey.html"));
  });

  //the survey submit fuctionality
  app.post("/api/friends", function(req, res) {
    
    friendsArray.push(req.body);

      //figure out who is the best match
      //set score a huge number
      var matchScore = 1000;
      var curUser = req.body;
      var matchUser = friendsArray[0];

      //go through friends array
      friendsArray.forEach( person => {

        //we do not want to query the users answer... The persons best match will always be himself!!
        if( person.name != curUser.name ){
          var scoreDiff = 0;

          //check each friends score with current user
          for( var i = 0; i < 10; i++) {
              scoreDiff += Math.abs( parseInt(person.scores[i]) - parseInt( curUser.scores[i] )  )
          }
  
          // console.log("User: "+person.name);
          // console.log("Has score difference: "+scoreDiff);
  
          if ( scoreDiff < matchScore ){
            matchUser = person;
            matchScore = scoreDiff;
            //console.log("User: "+ person.name+" is so far the best match");
          }
        }
      })

      //console.log("Best Match found!!");
      //console.log("User: "+ matchUser.name+" with picture: "+matchUser.photo);

      var obj = {
        name: matchUser.name,
        photo: matchUser.photo
      }
      
      res.json(obj);
  });
};