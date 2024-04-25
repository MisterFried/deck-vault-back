import { getAllCards, getMonsterCards, getSpellCards, getTrapCards, getSpecificCard, getCardsByName, getCardPrints } from "../models/cardsModels.js";

export async function processAllCards() {
	const allCardsDB = await getAllCards();
	return allCardsDB;
}

export async function processMonsterCards() {
	const monsterCardsDB = await getMonsterCards();
	return monsterCardsDB;
}

export async function processSpellCards() {
	const spellCardsDB = await getSpellCards();
	return spellCardsDB;
}

export async function processTrapCards() {
	const trapCardsDB = await getTrapCards();
	return trapCardsDB;
}

export async function processSpecificCard(name) {
	const specificCardDB = await getSpecificCard(name);

	if (specificCardDB.length === 0) return null;

	const prints = await getCardPrints(specificCardDB[0].id);

	return {...specificCardDB[0], prints: prints};
}

export async function processCardsByName(name) {
	const cardsByNameDB = await getCardsByName(name);
	return cardsByNameDB;
}