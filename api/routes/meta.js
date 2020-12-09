import express from "express"
import Element from "../../models/element.js"
import service from "../../services/meta.js";

const route = express.Router();

export default (app) => {

  app.use("/meta", route)

  route.get('/', function (req, res, next) {
    res.json(Element.search("tag:element").map(e => { return { id: e._id, name: e.name, type: e.type } }))
  });

  route.get('/menu', function (req, res, next) {
    res.json(service.genMenu())
  });

  route.get('/labels', async function (req, res, next) {
    res.json(await service.getLabels())
  });

  route.get('/:type/:name', function (req, res, next) {
    res.json(Element.lookupType(req.params.type, req.params.name).toObj())
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