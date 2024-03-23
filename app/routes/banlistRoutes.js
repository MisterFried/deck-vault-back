import express from "express";
import { processBanlist } from "../controllers/banlistController.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const banlist = await processBanlist("all");
		res.status(200).send(banlist);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/banned", async (req, res) => {
	try {
		const banlist = await processBanlist("banned");
		res.status(200).send(banlist);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/limited", async (req, res) => {
	try {
		const banlist = await processBanlist("limited");
		res.status(200).send(banlist);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/semi-limited", async (req, res) => {
	try {
		const banlist = await processBanlist("semi-limited");
		res.status(200).send(banlist);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

export default router;
