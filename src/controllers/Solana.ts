import GoldRush from "../config/goldrush";
import SolanaFm from "../config/solana.fm";

const goldrushClient = GoldRush();
const solanaFMClient = SolanaFm();

const network = "solana-mainnet";

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

	try {
		return (
			await solanaFMClient.TransactionService.getAccountTransactions(
				walletAddress,
			)
		).data;
	} catch (err) {
		throw new Error(err);
	}
};

export const getTransactionDetails = async (txHash: string | string[]) => {
	const transactionHashes = typeof txHash === "string" ? [txHash] : txHash;

	if (transactionHashes.length === 0)
		throw new Error("transaction hashes not supplied");

	if (transactionHashes.length > 50)
		throw new Error("transaction hashes supplied exceeds 50");

	try {
		return (
			await solanaFMClient.TransactionService.getTransactionDetails(txHash)
		).data;
	} catch (err) {
		throw new Error(err);
	}
};
