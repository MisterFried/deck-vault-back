import { getDatabase } from "../lib/databaseInit.js";

// Get the list of all the cards
export async function getAllCards(page, perPage) {
	const db = await getDatabase();

	// Calculate pagination offset
	const offset = (page - 1) * perPage;

	const query = `SELECT cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, GROUP_CONCAT(images.imageID) AS images 
	FROM cards 
	INNER JOIN images ON cards.id = images.cardID 
	GROUP BY cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist 
	LIMIT ? 
	OFFSET ?`;
	const [rows] = await db.execute(query, [`${perPage}`, `${offset}`]);
	const [total] = await db.execute("SELECT COUNT(*) AS total FROM cards");

	return {
		total: total[0].total,
		cards: rows || [],
	};
}

// Returns the details of the specified card
export async function getSpecificCard(name) {
	const db = await getDatabase();

	const query = `SELECT cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, GROUP_CONCAT(images.imageID) AS images 
	FROM cards 
	INNER JOIN images ON cards.id = images.cardID 
	WHERE cards.name = ? 
	GROUP BY cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist`;
	const [rows] = await db.execute(query, [name]);

	return rows.length === 0 ? null : rows[0];
}

// Get the list of all the cards that match the specified name
export async function getCardsByName(name, page, perPage) {
	const db = await getDatabase();

	// Calculate pagination offset
	const offset = (page - 1) * perPage;

	const query = `SELECT cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, GROUP_CONCAT(images.imageID) AS images 
	FROM cards 
	INNER JOIN images ON cards.id = images.cardID 
	WHERE name LIKE ? 
	GROUP BY cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist 
	LIMIT ? 
	OFFSET ?`;
	const [rows] = await db.execute(query, [`%${name}%`, `${perPage}`, `${offset}`]);
	const [total] = await db.execute("SELECT COUNT(*) AS total FROM cards WHERE name LIKE ?", [
		`%${name}%`,
	]);

	return {
		total: total[0].total,
		cards: rows || [],
	};
}

// Get the list of all the prints of the specified card
export async function getCardPrints(id) {
	const db = await getDatabase();

	const query = `SELECT prints.id, prints.rarity, prints.code, sets.name AS setName, sets.date AS date 
	FROM prints 
	INNER JOIN sets ON prints.setID = sets.id 
	WHERE prints.cardID = ?`;
	const [rows] = await db.execute(query, [id]);

	return rows;
}
