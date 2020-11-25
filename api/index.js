let Router = require("express").Router;
let meta = require('./routes/meta');

module.exports = () => {
	const app = Router();
	meta(app);

	return app
}