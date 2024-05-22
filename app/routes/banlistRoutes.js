import express from "express";
import { processBanlistCards } from "../controllers/banlistController.js";
import formatError from "../lib/formatError.js";

const router = express.Router();

// Returns the list of all the cards on the banlist no matter the status
router.get("/", async (req, res) => {
	try {
		const banlistCards = await processBanlistCards("all");

		res.status(200).send(banlistCards);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

// Returns the list of all the banned cards
router.get("/banned", async (req, res) => {
	try {
		const bannedCards = await processBanlistCards("banned");

		res.status(200).send(bannedCards);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

// Returns the list of all the limited cards
router.get("/limited", async (req, res) => {
	try {
		const limitedCards = await processBanlistCards("limited");

		res.status(200).send(limitedCards);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

// Returns the list of all the semi-limited cards
router.get("/semi-limited", async (req, res) => {
	try {
		const semiLimitedCards = await processBanlistCards("semi-limited");

		res.status(200).send(semiLimitedCards);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

export default router;
