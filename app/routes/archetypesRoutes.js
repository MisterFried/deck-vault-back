import express from "express";
import { processArchetypes, processArchetypeCards } from "../controllers/archetypesController.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const archetypesList = await processArchetypes();
		res.status(200).send(archetypesList);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/:name", async (req, res) => {
	try {
		const name = req.params.name;
		const cardsList = await processArchetypeCards(name);

		if (cardsList.length === 0) res.status(404).send("The specified archetype does not exist.");
		else res.status(200).send(cardsList);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

export default router;
