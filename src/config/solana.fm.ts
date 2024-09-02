import env from "./env";
import axios from "axios";

const { SOLANAFM_API_KEY } = env;

if (!SOLANAFM_API_KEY) throw new Error("Invalid solana.fm API Key");

const solanafmBaseUrl = "https://api.solana.fm";

const SolanaFm = () => {
	axios.defaults.baseURL = solanafmBaseUrl;
	axios.defaults.headers.common.ApiKey = SOLANAFM_API_KEY;

	return {
		// get transaction details for the supplied tx hashes
		TransactionService: {
			getTransactionDetails: (txHash: string | string[]) => {
				return axios.request({
					method: "POST",
					url: "v0/transfers",
					data: { transactionHashes: txHash },
				});
			},

			// get transaction for the provided account
			getAccountTransactions: (
				account: string,
				page?: number,
				limit = 1000,
			) => {
				return axios.request({
					method: "GET",
					url: `v0/accounts/${account}/transactions`,
					params: {
						page: page || 1,
						limit: limit || 1000,
					},
				});
			},
		},
	};
};

export default SolanaFm;
