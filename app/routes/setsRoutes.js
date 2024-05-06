import express from "express";
import { processSets, processSetBreakdown } from "../controllers/setsController.js";

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
		const setBreakdown = await processSetBreakdown(code);

		if (setBreakdown === null) res.status(404).send("The specified set does not exist.");
		else res.status(200).send(setBreakdown);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

export default router;
