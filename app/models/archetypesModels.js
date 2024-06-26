import { getDatabase } from "../lib/databaseInit.js";

// Get the list of all the archetypes
export async function getArchetypesList() {
	const db = await getDatabase();

	const [rows] = await db.execute("SELECT name FROM archetypes");
	return rows;
}

// Get the list of all the cards of the specified archetype along with some additional information
export async function getArchetypeCards(name, search, page, perPage) {
	const db = await getDatabase();

	// Calculate pagination offset
	const offset = (page - 1) * perPage;

	// If search is empty, get all the cards of the specified archetype
	if (search === "") {
		const query = `SELECT cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, GROUP_CONCAT(images.imageID) AS images 
		FROM cards 
		INNER JOIN images ON cards.id = images.cardID 
		WHERE archetype = ? 
		GROUP BY cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist 
		LIMIT ? 
		OFFSET ?`;
		const [rows] = await db.execute(query, [name, `${perPage}`, `${offset}`]);
		const [total] = await db.execute(
			"SELECT COUNT(*) AS total FROM cards WHERE archetype = ?",
			[name]
		);

		return {
			total: total[0].total,
			cards: rows || [],
		};
	}

	// If search is not empty, get the cards of the specified archetype that match the search
	const query = `SELECT cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, GROUP_CONCAT(images.imageID) AS images 
	FROM cards 
	INNER JOIN images ON cards.id = images.cardID 
	WHERE archetype = ? AND name LIKE ? 
	GROUP BY cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist 
	LIMIT ? 
	OFFSET ?`;
	const [rows] = await db.execute(query, [name, `%${search}%`, `${perPage}`, `${offset}`]);
	const [total] = await db.execute(
		"SELECT COUNT(*) AS total FROM cards WHERE archetype = ? AND name LIKE ?",
		[name, `%${search}%`]
	);

	return {
		total: total[0].total,
		cards: rows || [],
	};
}
