import express from "express";

import { processAllCards, processMonsterCards, processSpellCards, processTrapCards, processSpecificCard, processCardsByName } from "../controllers/cardsController.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const allCards = await processAllCards();
		res.status(200).send(allCards);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/monster", async (req, res) => {
	try {
		const monsterCards = await processMonsterCards();
		res.status(200).send(monsterCards);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/spell", async (req, res) => {
	try {
		const spellCards = await processSpellCards();
		res.status(200).send(spellCards);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/trap", async (req, res) => {
	try {
		const trapCards = await processTrapCards();
		res.status(200).send(trapCards);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/search/:name", async (req, res) => {
	try {
		const name = req.params.name;
		const card = await processSpecificCard(decodeURIComponent(name.replaceAll("_", " ")));

		if (!card) res.status(404).send("This card does not exist.");
		else res.status(200).send(card);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/:name", async (req, res) => {
	try {
		const name = req.params.name;
		const cards = await processCardsByName(name);

		if (cards.length === 0) res.status(404).send("No cards matching the specified name.");
		else res.status(200).send(cards);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

export default router;
