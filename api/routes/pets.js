let { Router, Request, Response } = require("express")
const route = Router();
let service = require("../../services/pets")

module.exports = (app) => {

    app.use("/pets", route)

    route.get('/', function(req, res, next) {
        res.json(service.all())
    });

    route.post('/', function(req, res, next) {
        res.json(service.add(req.body.name, req.body.breed, req.body.age))
    });

    route.get('/:name', function(req, res, next) {
        res.json(service.get(req.params.name))
    });

    route.delete('/:name', function(req, res, next) {
        service.del(req.params.name)
        res.json(true)
    });
};