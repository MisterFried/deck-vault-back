import {
	getAllCards,
	getSpecificCard,
	getCardsByName,
	getCardPrints,
} from "../models/cardsModels.js";

// Get the list of all the cards
export async function processAllCards(page, perPage) {
	const allCards = await getAllCards(page, perPage);

	allCards.cards.forEach(card => {
		card.images = card.images.split(",").map(id => Number(id));
	});

	return allCards;
}

// Returns the details of the specified card
export async function processSpecificCard(name) {
	const cardDetails = await getSpecificCard(name);

	if (!cardDetails) return null;

	cardDetails.images = cardDetails.images.split(",").map(id => Number(id));

	// Get the list of all the prints of the card
	const cardPrints = await getCardPrints(cardDetails.id);

	return { ...cardDetails, prints: cardPrints };
}

// Returns the list of all the cards that match the specified name
export async function processCardsByName(name, page, perPage) {
	const cards = await getCardsByName(name, page, perPage);

	cards.cards.forEach(card => {
		card.images = card.images.split(",").map(id => Number(id));
	});

	return cards;
}
