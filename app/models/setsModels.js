import { getDatabase } from "../lib/databaseInit.js";

export async function getSets() {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT * FROM sets");
	return rows;
}

export async function getSetCards(ids) {
	const db = await getDatabase();

	const finalCardsList = [];

	for (let i = 0; i < ids.length; i++) {
		const [cards] = await db.query(
			"SELECT cards.id cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, prints.rarity, prints.code FROM cards INNER JOIN prints ON cards.id = prints.card_id WHERE prints.product_id = ?",
			[ids[i].id]
		);
		finalCardsList.push({
			set_name: ids[i].name,
			set_code: ids[i].code,
			set_date: ids[i].date,
			cards: cards,
		});
	}

	return finalCardsList;
}
