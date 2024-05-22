import express from "express";
import { processArchetypesList, processArchetypeCards } from "../controllers/archetypesController.js";
import formatError from "../lib/formatError.js";

const router = express.Router();

// Returns the list of all the archetypes
router.get("/", async (req, res) => {
	try {
		const archetypesList = await processArchetypesList();

		res.status(200).send(archetypesList);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

// Returns the list of all the cards of the specified archetype along with some additional information
router.get("/:name", async (req, res) => {
	try {
		let archetype = req.params.name;
		archetype = decodeURIComponent(archetype.toLowerCase().replaceAll("_", " "));

		let {search, page, perPage} = req.query;
		if (!page || isNaN(Number(page)) || page < 1) page = 1;
		if (!perPage || isNaN(Number(perPage)) || perPage < 10 || perPage > 100) perPage = 10;
		if (!search) search = "";

		const archetypeCards = await processArchetypeCards(archetype, search, page, perPage);

		if (!archetypeCards) res.status(404).send("The specified archetype does not exist.");
		
		res.status(200).send(archetypeCards);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

export default router;
