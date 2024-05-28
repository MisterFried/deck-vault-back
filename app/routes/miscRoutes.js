import express from "express";
import formatError from "../lib/formatError.js";
import { processMonsterCategories } from "../controllers/miscController.js";

const router = express.Router();

// Returns the list of all the existing monster cards category
router.get("/monsterCategories", async (req, res) => {
	try {
		const monsterCategories = await processMonsterCategories();

		res.status(200).send(monsterCategories);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

export default router;
