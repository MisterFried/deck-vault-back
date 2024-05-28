import mysql from "mysql2/promise";
import { readLargeFile, writeLargeFile } from "./readWriteFiles.js";
import fetchData from "./fetchData.js";
import checkVolume from "./checkVolume.js";

let db;

export async function databaseInit() {
	// Connect to the database
	db = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: "root",
		password: "password",
		database: "db",
	});
	console.log("Connected to the database");

	// Create tables in the database
	try {
		console.log("Creating tables in the database...");
		const createCardsTableQuery = `CREATE TABLE IF NOT EXISTS cards (
			id INT PRIMARY KEY, 
			name VARCHAR(255) NOT NULL, 
			attribute VARCHAR(255), 
			level INT, 
			type VARCHAR(255), 
			category VARCHAR(255) NOT NULL, 
			description TEXT NOT NULL, 
			atk INT, 
			def INT, 
			archetype VARCHAR(255), 
			link INT, 
			scale INT, 
			banlist VARCHAR(255) NOT NULL
		)`;
		await db.execute(createCardsTableQuery);
		console.log("Cards table created");

		const createArchetypesTableQuery = `CREATE TABLE IF NOT EXISTS archetypes (
			id INT PRIMARY KEY, 
			name VARCHAR(255) NOT NULL
		)`;
		await db.execute(createArchetypesTableQuery);
		console.log("Archetypes table created");

		const createImagesTableQuery = `CREATE TABLE IF NOT EXISTS images (
			id INT PRIMARY KEY, 
			card_id int NOT NULL, 
			image_id int NOT NULL
		)`;
		await db.execute(createImagesTableQuery);
		console.log("Images table created");

		const createPrintsTableQuery = `CREATE TABLE IF NOT EXISTS prints (
			id INT PRIMARY KEY, 
			card_id int NOT NULL, 
			product_id int NOT NULL, 
			rarity VARCHAR(255) NOT NULL, 
			code VARCHAR(255) NOT NULL
		)`;
		await db.execute(createPrintsTableQuery);
		console.log("Prints table created");

		const createSetsTableQuery = `CREATE TABLE IF NOT EXISTS sets (
			id INT PRIMARY KEY, 
			name VARCHAR(255) NOT NULL, 
			code VARCHAR(255) NOT NULL, 
			date DATE NOT NULL, 
			cards_amount INT NOT NULL)`;
		await db.execute(createSetsTableQuery);
		console.log("Sets table created");

		const createMonsterCategoryTableQuery = `CREATE TABLE IF NOT EXISTS monster_category (
			id INT PRIMARY KEY, 
			name VARCHAR(255) NOT NULL
		)`;
		await db.execute(createMonsterCategoryTableQuery);
		console.log("Monster category table created");

		console.log("All tables were created successfully");
	} catch (err) {
		console.log("An error occurred during tables creation");
		throw err;
	}

	//Check for files in the volume
	const filesExists = checkVolume();

	//If files do not exist, fetch data from the internet and save it in the volume
	if (!filesExists) {
		console.log("Fetching data from the internet...");
		const { cards, archetypes, images, sets, prints, monsterCategory } = await fetchData();
		await writeLargeFile("/fetched-data/cards.json", JSON.stringify(cards));
		await writeLargeFile("/fetched-data/archetypes.json", JSON.stringify(archetypes));
		await writeLargeFile("/fetched-data/images.json", JSON.stringify(images));
		await writeLargeFile("/fetched-data/sets.json", JSON.stringify(sets));
		await writeLargeFile("/fetched-data/prints.json", JSON.stringify(prints));
		await writeLargeFile("/fetched-data/monsterCategory.json", JSON.stringify(monsterCategory));
		console.log("Data fetched and saved in the volume successfully");
	}

	// Insert data into the database
	try {
		console.log("Inserting data into the database...");

		const cardsData = await readLargeFile("/fetched-data/cards.json");
		const cardsJSON = await JSON.parse(cardsData);
		const insertCardsData = cardsJSON.map(card => [
			card.id,
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
		const insertCardsQuery = `INSERT IGNORE INTO cards (
			id, 
			name, 
			attribute, 
			level, 
			type, 
			category, 
			description, 
			atk, 
			def, 
			archetype, 
			link, 
			scale, 
			banlist
		) 
		VALUES ?`;
		await db.query(insertCardsQuery, [insertCardsData]);
		console.log("Cards data inserted");

		const archetypesData = await readLargeFile("/fetched-data/archetypes.json");
		const archetypesJSON = await JSON.parse(archetypesData);
		const insertArchetypesData = archetypesJSON.map(archetype => [
			archetype.id,
			archetype.name,
		]);
		const insertArchetypesQuery = `INSERT IGNORE INTO archetypes (
			id, 
			name
		) 
		VALUES ?`;
		await db.query(insertArchetypesQuery, [insertArchetypesData]);
		console.log("Archetypes data inserted");

		const imagesData = await readLargeFile("/fetched-data/images.json");
		const imagesJSON = await JSON.parse(imagesData);
		const insertImagesData = imagesJSON.map(image => [image.id, image.card_id, image.image_id]);
		const insertImagesQuery = `INSERT IGNORE INTO images (
			id, 
			card_id, 
			image_id
		) 
		VALUES ?`;
		await db.query(insertImagesQuery, [insertImagesData]);
		console.log("Images data inserted");

		const setsData = await readLargeFile("/fetched-data/sets.json");
		const setsJSON = await JSON.parse(setsData);
		const insertSetsData = setsJSON.map(set => [
			set.id,
			set.name,
			set.code,
			set.date,
			set.cards_amount,
		]);
		const insertSetsQuery = `INSERT IGNORE INTO sets (
			id, 
			name, 
			code, 
			date, 
			cards_amount
		) 
		VALUES ?`;
		await db.query(insertSetsQuery, [insertSetsData]);
		console.log("Sets data inserted");

		const printsData = await readLargeFile("/fetched-data/prints.json");
		const printsJSON = await JSON.parse(printsData);
		const insertPrintsData = printsJSON.map(print => [
			print.id,
			print.card_id,
			print.product_id,
			print.rarity,
			print.code,
		]);
		const insertPrintsQuery = `INSERT IGNORE INTO prints (
			id, 
			card_id, 
			product_id, 
			rarity, 
			code
		) 
		VALUES ?`;
		await db.query(insertPrintsQuery, [insertPrintsData]);
		console.log("Prints data inserted");

		const monsterCategoryData = await readLargeFile("/fetched-data/monsterCategory.json");
		const monsterCategoryJSON = await JSON.parse(monsterCategoryData);
		const insertMonsterCategoryData = monsterCategoryJSON.map(monsterCategory => [
			monsterCategory.id,
			monsterCategory.name,
		]);
		const insertMonsterCategoryQuery = `INSERT IGNORE INTO monster_category (
			id, 
			name
		) 
		VALUES ?`;
		await db.query(insertMonsterCategoryQuery, [insertMonsterCategoryData]);
		console.log("Monster category data inserted");

		console.log("All data was inserted successfully");
	} catch (err) {
		console.log("An error occurred during tables insertion");
		throw err;
	}
}

export async function getDatabase() {
	if (!db) await databaseInit();
	return db;
}
