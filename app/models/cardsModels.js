import { getDatabase } from "../lib/databaseInit.js";

export async function getAllCards() {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT * FROM cards");
	return rows;
}

export async function getMonsterCards() {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT * FROM cards WHERE attribute IS NOT NULL");
	return rows;
}

export async function getSpellCards() {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT * FROM cards WHERE category = 'Spell Card'")
	return rows;
}

export async function getTrapCards() {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT * FROM cards WHERE category = 'Trap Card'")
	return rows;
}

export async function getSpecificCard(name) {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT * FROM cards WHERE name = ?", [name]);
	return rows;
}

export async function getCardsByName(name) {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT * FROM cards WHERE name LIKE ?", [`%${name}%`]);
	return rows;
}

export async function getCardPrints(id) {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT prints.id, prints.rarity, prints.code, sets.name AS set_name, sets.code AS set_code, sets.date AS set_date FROM prints INNER JOIN sets ON prints.product_id = sets.id WHERE prints.card_id = ?", [id]);
	return rows;
}