import { getBanlist } from "../models/banlistModels.js";

// Returns the list of all the cards on the banlist depending on the status
export async function processBanlistCards(status) {
	const banlistCards = await getBanlist(status);

	// Convert the image IDs from a string to an array of numbers
	banlistCards.forEach((card) => {
		card.image_ids = (card.image_ids.split(",")).map((id) => Number(id));
	});

	return banlistCards;
}
