import { getDatabase } from "../lib/databaseInit.js";

// Get the list of all the sets
export async function getSetsList() {
	const db = await getDatabase();

	const [rows] = await db.execute(
		"SELECT id, name, code, date, cardsAmount FROM sets"
	);
	return rows;
}

// Get the breakdown of the specified set will all its variants
export async function getSetBreakdown(variants) {
	const db = await getDatabase();

	const variantsDetails = [];

	for (let i = 0; i < variants.length; i++) {
		const query = `SELECT cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, prints.rarity, prints.code, GROUP_CONCAT(images.imageID) AS images 
		FROM cards 
		INNER JOIN prints ON cards.id = prints.cardID 
		INNER JOIN images ON cards.id = images.cardID 
		WHERE prints.setID = ? 
		GROUP BY cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, prints.rarity, prints.code`;
		const [rows] = await db.execute(query, [variants[i].id]);

		variantsDetails.push({
			name: variants[i].name,
			code: variants[i].code,
			date: variants[i].date,
			cards: rows,
		});
	}

	return variantsDetails;
}
