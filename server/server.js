//var DatabaseConnection = require("./server/database.js");
//var QueryConverter = require("./server/queryconverter.js");
//var moment = require("moment");
//var connect = require("connect");
var bodyParser = require('body-parser')
var API = require('./api.js')



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



var express = require('express')
   , http = require('http')
   , path = require('path');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(/\/api\/.+/, router);
app.use(express.static(path.join(__dirname, '..', 'www')));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
})






/*
var app = connect()
	.use(connect.staticCache())
	.use(connect.static('www'))
	//.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false }))
	.use("/request", function(req, res){

		if(req.body !== undefined && req.body.type === "query"){
				getUserConnection(req.body.username, req.body.password, function(db){
					tableAbstraction.handleAction(db, req.body, function(actionResult){
						res.writeHead(200, {'Content-Type':'application/json'});
						res.end(JSON.stringify(actionResult));
					});
				});
			} else {
				res.end("Invalid request!");
			}
	})
	.use("/e", function(req, res){

		if(req.body !== undefined && req.body.name !== ""){
				console.log(req.body)
				res.writeHead(200, {'Content-Type':'application/json'});
				res.end(JSON.stringify({name: req.body.name}));
			} else {
				res.end("Invalid request!");
			}
	})
	.listen(3000);
	*/
