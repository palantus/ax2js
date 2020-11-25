var bodyParser = require('body-parser')



var router = async function(req, res){
  var data = req.body;
  if(data === undefined || (Object.keys(data).length === 0 && data.constructor === Object))
    data = req.query;

  var command = req.baseUrl.substring(5).toLowerCase() //anything after /api/
  if(command === undefined || command == ""){
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({error: "Invalid request!", path: req.path}));
    return;
  }

  var parts = command.split("/");

  var respond = function(result, contentType){
    if(result !== null && result !== undefined){
      if(contentType === undefined)
        res.writeHead(200, {'Content-Type':'application/json'});
      else
        res.writeHead(200, {'Content-Type': contentType});
      res.end(result);
    } else {
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({error: "Unknown request type: " + command, data: data, baseUrl: req.baseUrl}));
    }
  }

  let api = new API();
  await api.init()
  api.respond = respond;

  if(parts[0] == "element")
    api.handleElementRequest(parts.slice(1), data);
  else if(parts[0] == "tree")
    api.handleTreeRequest(parts.slice(1), data);
  else {
    respond()
  }

}


let load = async () => {

  var express = require('express')
    , http = require('http')
    , path = require('path');
  let cors = require('cors');
  var app = express();
  let Entity = require("entitystorage")
  let {uiPath, uiAPI} = await Entity.init("./data");
  let routes = require('./api');

  app.enable('trust proxy');
  app.use(cors());
  app.set('port', process.env.PORT || 3000);
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use("/db", express.static(uiPath))
  app.use("/db/api/:query", uiAPI)
  app.use("/api", routes());
  app.use(express.static('www'));

  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  })


}

load();