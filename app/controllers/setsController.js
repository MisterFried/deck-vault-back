import { getSets, getSetCards } from "../models/setsModels.js";

export async function processSets() {
	const setsDB = await getSets();
	const processedSets = setsDB.map(set => {
		return {
			name: set.name,
			code: set.code,
			date: set.date,
			cards_amount: set.cards_amount,
		};
	});
	return processedSets;
}

export async function processSetCards(code) {
	const setsList = await getSets();
	const matchingSets = setsList.filter(set => set.code === code);
	if (matchingSets.length === 0) return [];

	const matchingSetsId = matchingSets.map(set => {
		return {
			name: set.name,
			code: set.code,
			date: set.date,
			id: set.id,
		};
	});
	const cardsListDB = await getSetCards(matchingSetsId);
	return cardsListDB;
}
