import GoldRush from "../config/goldrush";

const goldrushClient = GoldRush();
const network = "btc-mainnet";

export const getTokenBalances = async (walletAddress: string) => {
	if (!walletAddress) throw new Error("WalletAddress not found");

	try {
		return await goldrushClient.BalanceService.getTokenBalancesForWalletAddress(
			network,
			walletAddress,
			{ noSpam: true, quoteCurrency: "USD" },
		);
	} catch (err) {
		throw new Error(err);
	}
};

export const getAccountTransactions = async (walletAddress: string) => {
	if (!walletAddress) throw new Error("WalletAddress not found");

	return "";
};
