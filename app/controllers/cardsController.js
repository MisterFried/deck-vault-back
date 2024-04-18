import { getAllCards, getMonsterCards, getSpellCards, getTrapCards, getSpecificCard, getCardsByName } from "../models/cardsModels.js";

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
	return specificCardDB;
}

export async function processCardsByName(name) {
	const cardsByNameDB = await getCardsByName(name);
	return cardsByNameDB;
}