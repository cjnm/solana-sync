import { GoldRushClient } from "@covalenthq/client-sdk";
import env from "./env";

const { GOLD_RUSH_API_KEY } = env;

if (!GOLD_RUSH_API_KEY) throw new Error("Invalid Goldrush API Key");

const GoldRush = () => {
	return new GoldRushClient(GOLD_RUSH_API_KEY);
};

export default GoldRush;
