import { getDatabase } from "../lib/databaseInit.js";

// Get all the cards on the banlist depending on the status
export async function getBanlist(status) {
	const db = await getDatabase();

	// If status is 'all', get all the cards on the banlist
	if (status === "all") {
		const query = `SELECT cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, GROUP_CONCAT(images.image_id) AS images 
		FROM cards 
		INNER JOIN images ON cards.id = images.card_id 
		WHERE banlist = 'banned' OR banlist = 'limited' OR banlist = 'semi-limited' 
		GROUP BY cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist`;
		const [rows] = await db.execute(query);
		return rows;
	}

	// Otherwise, get only the cards on the banlist with the specified status
	const query = `SELECT cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, GROUP_CONCAT(images.image_id) AS images 
	FROM cards 
	INNER JOIN images ON cards.id = images.card_id 
	WHERE banlist = ? 
	GROUP BY cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist`;
	const [rows] = await db.execute(query, [status]);
	return rows;
}
