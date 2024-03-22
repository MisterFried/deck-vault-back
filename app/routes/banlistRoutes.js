import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
	res.status(200).send("List of the current banlist");
});

export default router;