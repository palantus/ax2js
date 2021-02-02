import bodyParser from 'body-parser'
import express from'express'
import path from'path'
import cors from'cors'
import Entity from'entitystorage'
import routes from'./api/index.js'
import http from "http"

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv'
dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url));

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

  var app = express();
  let {uiPath, uiAPI} = await Entity.init("./data");

  app.enable('trust proxy');
  app.use(cors());
  app.set('port', process.env.PORT || 3000);
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use("/db", express.static(uiPath))
  app.use("/db/api/:query", uiAPI)
  app.use("/api", routes());
  app.use(express.static('www'));
  app.use("/ax", (req, res) => res.sendFile(path.join(__dirname, "www/index.html")))
  app.get("/favicon.ico", (req, res) => res.sendFile(path.join(__dirname, "www/img/favicon.ico")))

  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  })


}

load();