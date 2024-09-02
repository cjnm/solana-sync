import {
	getTokenBalances,
	getAccountTransactions,
	getTransactionDetails,
} from "./controllers/Solana";

const solanaWalletAddress = "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1";

// save soalan token balances
const saveTokenBalances = async () => {
	const tokenBalance = await getTokenBalances(solanaWalletAddress).catch(
		(error) => {
			throw new Error(error);
		},
	);

	if (tokenBalance.error) {
		throw new Error(tokenBalance.error_message);
	}

	console.log(tokenBalance);
};

// save wallet transactions
const saveWalletTransactions = async () => {
	const transactions = await getAccountTransactions(solanaWalletAddress).catch(
		(error) => {
			throw new Error(error);
		},
	);

	console.log(transactions);
};

saveWalletTransactions();
