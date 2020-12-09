import express from "express";
import meta from './routes/meta.js';

export default () => {
	const app = express.Router();
	meta(app);

	return app
}