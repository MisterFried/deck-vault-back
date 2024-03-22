import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
	res.status(200).send("List of all cards");
});

router.get("/monster", (req, res) => {
	res.status(200).send("List of all monster cards");
});

router.get("/spell", (req, res) => {
	res.status(200).send("List of all spell cards");
});

router.get("/trap", (req, res) => {
	res.status(200).send("List of all trap cards");
});

router.get("/search/:name", (req, res) => {
	res.status(200).send("A list of all cards containing the name");
});

router.get("/:name", (req, res) => {
	res.status(200).send("A detailed view of a card");
});

export default router;
