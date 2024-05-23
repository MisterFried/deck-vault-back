import express from "express";
import { processSetsList, processSetBreakdown } from "../controllers/setsController.js";
import formatError from "../lib/formatError.js";

const router = express.Router();

// Returns the list of all the sets
router.get("/", async (req, res) => {
	try {
		const setsList = await processSetsList();

		res.status(200).send(setsList);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

// Returns the breakdown of the specified set
router.get("/:code", async (req, res) => {
	try {
		const code = req.params.code;

		const setBreakdown = await processSetBreakdown(code);

		if (!setBreakdown) res.status(404).send("The specified set does not exist.");
		else res.status(200).send(setBreakdown);
	} catch (error) {
		console.error(error);
		res.status(500).send(formatError(error));
	}
});

export default router;
