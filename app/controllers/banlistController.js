import { getBanlist } from "../models/banlistModels.js";

export async function processBanlist(status) {
	const banlistDB = await getBanlist();

	switch (status) {
		case "banned":
			return banlistDB.filter(card => card.banlist === "Banned");
		case "limited":
			return banlistDB.filter(card => card.banlist === "Limited");
		case "semi-limited":
			return banlistDB.filter(card => card.banlist === "Semi-Limited");
		case "all":
			return banlistDB;
	}
}
