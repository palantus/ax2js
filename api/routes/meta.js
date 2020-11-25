let { Router, Request, Response } = require("express")
const route = Router();
let Element = require("../../models/element")
let service = require("../../services/meta")

module.exports = (app) => {

  app.use("/meta", route)

  route.get('/', function (req, res, next) {
    res.json(Element.search("tag:element").map(e => { return { id: e._id, name: e.name, type: e.type } }))
  });

  route.get('/menu', function (req, res, next) {
    res.json(service.genMenu())
  });

  route.get('/:id', function (req, res, next) {
    res.json(Element.lookup(req.params.id).toObj())
  });

  route.post('/:id/genAST', function (req, res, next) {
    //res.json(service.get(req.params.name))
  });

  route.post('/:id/compile', function (req, res, next) {
    //res.json(service.get(req.params.name))
  });
};