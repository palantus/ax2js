import express from "express"
import Element from "../../models/element.js"
import service from "../../services/meta.js";

const route = express.Router();

export default (app) => {

  app.use("/meta", route)

  route.get('/', function (req, res, next) {
    res.json(Element.search("tag:element").map(e => { return { id: e._id, name: e.name, type: e.type } })
              .concat(Element.search("tag:tablefield").map(e => { return { id: e._id, name: e.name, type: "tablefield", tableId: e.related?.element?._id}})))
  });

  route.get('/labels', async function (req, res, next) {
    res.json(await service.getLabels())
  });

  route.get('/form/:name/:control/:func.xpp', function (req, res, next) {
    let form = Element.lookupType("form", req.params.name)
    let element = Element.find(`tag:formcontrol element.id:${form} prop:name=${req.params.control}`)
    let func = req.params.func == "declaration" ? element?.related.declaration : element?.rels.function?.find(f => f.name == req.params.func)
    res.setHeader('content-type', 'text/plain');
    res.send(func?.related?.xpp?.source||null)
  });

  route.get('/form/:name/:control/:func-ast.json', function (req, res, next) {
    let form = Element.lookupType("form", req.params.name)
    let element = Element.find(`tag:formcontrol element.id:${form} prop:name=${req.params.control}`)
    let func = req.params.func == "declaration" ? element?.related.declaration : element?.rels.function?.find(f => f.name == req.params.func)
    res.json(func?.related?.ast?.source||null)
  });

  route.get('/:type/:name/:func.xpp', function (req, res, next) {
    let element = Element.lookupType(req.params.type, req.params.name)
    let func = req.params.func == "declaration" ? element?.related.declaration : element?.rels.function?.find(f => f.name == req.params.func)
    res.setHeader('content-type', 'text/plain');
    res.send(func?.related?.xpp?.source||null)
  });

  route.get('/:type/:name/:func-ast.json', function (req, res, next) {
    let element = Element.lookupType(req.params.type, req.params.name)
    let func = req.params.func == "declaration" ? element?.related.declaration : element?.rels.function?.find(f => f.name == req.params.func)
    res.json(func?.related?.ast?.source||null)
  });

  route.get('/:type/:name.mjs', function (req, res, next) {
    let element = Element.lookupType(req.params.type, req.params.name)
    res.setHeader('content-type', 'application/javascript');
    res.send(element?.related?.js?.source||null)
  });

  route.get('/:type/:name', function (req, res, next) {
    res.json(Element.lookupType(req.params.type, req.params.name)?.toObj())
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