import express from "express";
import { processSets, processSetCards } from "../controllers/setsController.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const setsList = await processSets();
		res.status(200).send(setsList);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/:code", async (req, res) => {
	try {
		const code = req.params.code;
		const cardsList = await processSetCards(code);

		if (cardsList.length === 0) res.status(404).send("The specified set does not exist.");
		else res.status(200).send(cardsList);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

export default router;
