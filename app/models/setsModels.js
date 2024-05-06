import { getDatabase } from "../lib/databaseInit.js";

export async function getSets() {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT * FROM sets");
	return rows;
}

export async function getSetBreakdown(variants) {
	const db = await getDatabase();

	const variantsDetails = [];

	for (let i = 0; i < variants.length; i++) {
		const variant = variants[i];
		const [cards] = await db.query(
			"SELECT cards.id, cards.name, cards.attribute, cards.level, cards.type, cards.category, cards.description, cards.atk, cards.def, cards.archetype, cards.link, cards.scale, cards.banlist, prints.rarity, prints.code FROM cards INNER JOIN prints ON cards.id = prints.card_id WHERE prints.product_id = ?",
			[variant.id]
		);
		variantsDetails.push({
			name: variant.name,
			code: variant.code,
			date: variant.date,
			cards: cards,
		});
	}


	return variantsDetails;
}
