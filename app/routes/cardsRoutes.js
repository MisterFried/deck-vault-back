import express from "express";
import {
	processAllCards,
	processSpecificCard,
	processCardsByName,
} from "../controllers/cardsController.js";
import formatError from "../lib/formatError.js";

const router = express.Router();

// Returns the list of all the cards
router.get("/", async (req, res) => {
	try {
		let { page, perPage } = req.query;
		if (!page || isNaN(Number(page)) || page < 1) page = 1;
		if (!perPage || isNaN(Number(perPage)) || perPage < 10 || perPage > 100) perPage = 10;

		const allCards = await processAllCards(page, perPage);

		res.status(200).send(allCards);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

// Returns the details of the specified card
router.get("/search/:name", async (req, res) => {
	try {
		const name = req.params.name;
		const decodedName = decodeURIComponent(name.replaceAll("_", " "));

		const cardDetails = await processSpecificCard(decodedName);

		if (!cardDetails) res.status(404).send("The specified card does not exist.");
		else res.status(200).send(cardDetails);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

// Returns the list of all the cards that match the specified name
router.get("/:name", async (req, res) => {
	try {
		const name = req.params.name;
		const decodedName = decodeURIComponent(name.replaceAll("_", " "));

		let { page, perPage } = req.query;
		if (!page || isNaN(Number(page)) || page < 1) page = 1;
		if (!perPage || isNaN(Number(perPage)) || perPage < 10 || perPage > 100) perPage = 10;

		const cards = await processCardsByName(decodedName, page, perPage);

		res.status(200).send(cards);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

export default router;
