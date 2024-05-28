import { getMonsterCategories } from "../models/miscModels.js";

// Get the list of all the monster cards category
export async function processMonsterCategories() {
	const monsterCategories = await getMonsterCategories();

	const processedMonsterCategories = monsterCategories.map(category => category.name);

	return processedMonsterCategories;
}
