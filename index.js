// Modules
import express from "express";
import mysql from "mysql2/promise";
import fetchData from "./fetchData.js";
import checkVolume from "./checkVolume.js";
import fs from "fs";

async function startServer() {
	// Variables
	const PORT = process.env.PORT || 3000;

	// Start the server
	const app = express();
	app.use(express.json());
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

	// Connect to the database
	const db = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: "root",
		password: "password",
		database: "db",
	});
	console.log("Connected to the database");

	//Check for files in the volume
	const filesExists = checkVolume();

	if (!filesExists) {
		console.log("Fetching data from the internet...");
		const { cards, archetypes, images, sets, prints } = await fetchData();
		await writeLargeFile("/fetched-data/cards.json", JSON.stringify(cards));
		await writeLargeFile("/fetched-data/archetypes.json", JSON.stringify(archetypes));
		await writeLargeFile("/fetched-data/images.json", JSON.stringify(images));
		await writeLargeFile("/fetched-data/sets.json", JSON.stringify(sets));
		await writeLargeFile("/fetched-data/prints.json", JSON.stringify(prints));
		console.log("Data fetched and saved in the volume successfully");
	}

	// Create tables in the database
	try {
		console.log("Creating tables in the database...");
		const createCardsTableQuery =
			"CREATE TABLE IF NOT EXISTS cards (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, attribute VARCHAR(255), level INT, type VARCHAR(255), category VARCHAR(255) NOT NULL, description TEXT NOT NULL, atk INT, def INT, archetype VARCHAR(255), link INT, scale INT, banlist VARCHAR(255) NOT NULL);";
		const [cardsResults, cardsFields] = await db.execute(createCardsTableQuery);
		console.log("Cards table created");

		const createArchetypesTableQuery =
			"CREATE TABLE IF NOT EXISTS archetypes (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL);";
		const [archetypeResults, archetypesFields] = await db.execute(createArchetypesTableQuery);
		console.log("Archetypes table created");

		const createImagesTableQuery =
			"CREATE TABLE IF NOT EXISTS images (id INT PRIMARY KEY AUTO_INCREMENT, card_id int NOT NULL, image_id int NOT NULL);";
		const [imageResults, imageFields] = await db.execute(createImagesTableQuery);
		console.log("Images table created");

		const createPrintsTableQuery =
			"CREATE TABLE IF NOT EXISTS prints (id INT PRIMARY KEY AUTO_INCREMENT, card_id int NOT NULL, product_id int NOT NULL, rarity VARCHAR(255) NOT NULL, code VARCHAR(255) NOT NULL);";
		const [printResults, printFields] = await db.execute(createPrintsTableQuery);
		console.log("Prints table created");

		const createSetsTableQuery =
			"CREATE TABLE IF NOT EXISTS sets (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, code VARCHAR(255) NOT NULL, date DATE NOT NULL, cards_amount INT NOT NULL);";
		const [setResults, setFields] = await db.execute(createSetsTableQuery);
		console.log("Sets table created");

		console.log("All tables were created successfully");
	} catch (err) {
		console.log("An error occurred during tables creation");
		throw err;
	}

	// Insert data into the database
	try {
		console.log("Inserting data into the database...");

		const cardsData = await readLargeFile("/fetched-data/cards.json");
		const cardsJSON = await JSON.parse(cardsData);
		const insertCardsData = cardsJSON.map(card => [
			card.name,
			card.attribute,
			card.level,
			card.type,
			card.category,
			card.description,
			card.atk,
			card.def,
			card.archetype,
			card.link,
			card.scale,
			card.banlist,
		]);
		const insertCardsQuery =
			"INSERT INTO cards (name, attribute, level, type, category, description, atk, def, archetype, link, scale, banlist) VALUES ?";
		const [cardsResults] = await db.query(insertCardsQuery, [insertCardsData]);
		console.log("Cards data inserted");

		const archetypesData = await readLargeFile("/fetched-data/archetypes.json");
		const archetypesJSON = await JSON.parse(archetypesData);
		const insertArchetypesData = archetypesJSON.map(archetype => [archetype.name]);
		const insertArchetypesQuery = "INSERT INTO archetypes (name) VALUES ?";
		const [ArchetypesResults] = await db.query(insertArchetypesQuery, [insertArchetypesData]);
		console.log("Archetypes data inserted");

		const imagesData = await readLargeFile("/fetched-data/images.json");
		const imagesJSON = await JSON.parse(imagesData);
		const insertImagesData = imagesJSON.map(image => [image.card_id, image.image_id]);
		const insertImagesQuery = "INSERT INTO images (card_id, image_id) VALUES ?";
		const [imagesResults] = await db.query(insertImagesQuery, [insertImagesData]);
		console.log("Images data inserted");

		const setsData = await readLargeFile("/fetched-data/sets.json");
		const setsJSON = await JSON.parse(setsData);
		const insertSetsData = setsJSON.map(set => [
			set.name,
			set.code,
			set.date,
			set.cards_amount,
		]);
		const insertSetsQuery = "INSERT INTO sets (name, code, date, cards_amount) VALUES ?";
		const [setsResults] = await db.query(insertSetsQuery, [insertSetsData]);
		console.log("Sets data inserted");

		const printsData = await readLargeFile("/fetched-data/prints.json");
		const printsJSON = await JSON.parse(printsData);
		const insertPrintsData = printsJSON.map(print => [
			print.card_id,
			print.product_id,
			print.rarity,
			print.code,
		]);
		const insertPrintsQuery = "INSERT INTO prints (card_id, product_id, rarity, code) VALUES ?";
		const [printsResults] = await db.query(insertPrintsQuery, [insertPrintsData]);
		console.log("Prints data inserted");

		console.log("All data was inserted successfully");
	} catch (err) {
		console.log("An error occurred during tables insertion");
		throw err;
	}

	console.log("Setting up routes...");

	app.get("/", (req, res) => {
		res.status(200).send("Hello World!");
	});

	app.get("/cards", async (req, res) => {
		const query = "SELECT * FROM cards";
		try {
			const [results, fields] = await db.execute(query);
			res.status(200).json(results);
		} catch (err) {
			res.status(500).send(err);
			throw err;
		}
	});

	app.get("/archetypes", async (req, res) => {
		try {
			const query = "SELECT * FROM archetypes";
			const [results, fields] = await db.execute(query);
			res.status(200).json(results);
		} catch (err) {
			res.status(500).send(err);
			throw err;
		}
	});

	app.get("/sets", async (req, res) => {
		const query = "SELECT * FROM sets";
		try {
			const [results, fields] = await db.execute(query);
			res.status(200).send(results);
		} catch (err) {
			res.status(500).send(err);
			throw err;
		}
	});

	console.log("Everything is running fine !");
}

startServer();

async function readLargeFile(path) {
	return new Promise((resolve, reject) => {
		let data = "";

		const readStream = fs.createReadStream(path);
		readStream.on("data", chunk => {
			data += chunk;
		});
		readStream.on("end", () => {
			resolve(data);
		});
		readStream.on("error", err => {
			reject(err);
		});
	});
}

async function writeLargeFile(path, data) {
	return new Promise((resolve, reject) => {
		const writeStream = fs.createWriteStream(path);

		writeStream.write(data, "utf8", err => {
			if (err) reject(err);
			else resolve();
		});

		writeStream.end();
	});
}
