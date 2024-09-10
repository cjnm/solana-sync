import { SolanaWalletTokenBalanceModel } from "../models/SolanaWalletTokenBalance";
import {
	getTokenBalances,
	getAccountTransactions,
	getTransactionDetails,
} from "../controllers/Solana";
import { SolanaAccountTransactionsModel } from "../models/SolanaAccountTransactions";
import { SolanaTransactionDetailsModel } from "../models/SolanaTransactionDetails";
import { AccountTotalBalance } from "../models/AccountTotalBalance";

type transaction = {
	blockTime: number;
	confirmationStatus: string;
	err: null | string;
	memo: null | string;
	signature: string;
	slot: number;
};

// save soalan token balances
const saveTokenBalances = async (solanaWalletAddress: string, user: string) => {
	const tokenBalance = await getTokenBalances(solanaWalletAddress).catch(
		(error) => {
			throw new Error(error);
		},
	);

	if (tokenBalance.error) {
		throw new Error(tokenBalance.error_message);
	}

	if (!tokenBalance?.data) {
		throw new Error("No data.");
	}

	const { address } = tokenBalance.data;
	await SolanaWalletTokenBalanceModel.findOneAndUpdate(
		{ address },
		{ ...tokenBalance.data, user, account: address },
		{
			upsert: true,
		},
	);
	console.log("token balance saved");

	// saving aggregate balance
	const total_balance = tokenBalance.data.items.reduce((total, datum) => {
		return total + datum.quote;
	}, 0);

	await AccountTotalBalance.findOneAndUpdate(
		{ account: address },
		{ amount: total_balance, user, account: address, sync_time: 1 },
		{
			upsert: true,
		},
	);
};

const saveWalletTransactions = async (
	solanaWalletAddress: string,
	user: string,
) => {
	const transactions = await getAccountTransactions(solanaWalletAddress).catch(
		(error) => {
			throw new Error(error);
		},
	);

	if (transactions.status !== "success") throw new Error(transactions.message);

	// Prepare bulk operations
	const bulkOps = transactions.result.data.map((transaction: any) => ({
		updateOne: {
			filter: { signature: transaction.signature },
			update: { $set: { ...transaction, user, account: solanaWalletAddress } },
			upsert: true,
		},
	}));

	SolanaAccountTransactionsModel.bulkWrite(bulkOps)
		.then((result) => {
			console.log("Bulk upsert completed:", result);
		})
		.catch((error) => {
			console.error("Error in bulk upsert:", error);
			throw new Error(error);
		});

	const tx_hashes = transactions.result.data.map(
		(item: transaction) => item.signature,
	);

	while (tx_hashes.length > 0) {
		const chunk = tx_hashes.slice(0, 50); // Get the first 50 elements
		tx_hashes.splice(0, 50); // Remove the first 50 elements

		const transactionDetails = await getTransactionDetails(chunk).catch(
			(error) => {
				throw new Error(error);
			},
		);

		if (transactionDetails.status !== "success")
			throw new Error(transactionDetails.message);

		// Prepare bulk operations
		const _bulkOps = transactionDetails.result.map((transaction: any) => ({
			updateOne: {
				filter: { transactionHash: transaction.transactionHash },
				update: {
					$set: { ...transaction, user, account: solanaWalletAddress },
				},
				upsert: true,
			},
		}));

		// Execute bulkWrite
		SolanaTransactionDetailsModel.bulkWrite(_bulkOps)
			.then((result: any) => {
				console.log("Bulk upsert completed:", result);
			})
			.catch((error: any) => {
				console.error("Error in bulk upsert:", error);
				throw new Error(error);
			});
	}

	console.log("Transaction sync done");
};

export { saveTokenBalances, saveWalletTransactions };
