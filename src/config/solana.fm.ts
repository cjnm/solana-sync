import env from "./env";
import axios from "axios";

const { SOLANAFM_API_KEY } = env;

if (!SOLANAFM_API_KEY) throw new Error("Invalid solana.fm API Key");

const solanafmBaseUrl = "https://api.solana.fm";

const SolanaFm = () => {
  const apiClient = axios.create({
    baseURL: solanafmBaseUrl,
    headers: {
      ApiKey: SOLANAFM_API_KEY,
    },
  });

  return {
    // get transaction details for the supplied tx hashes
    TransactionService: {
      getTransactionDetails: (txHash: string | string[]) => {
        return apiClient.request({
          method: "POST",
          url: "v0/transfers",
          data: { transactionHashes: txHash },
        });
      },

      // get transaction for the provided account
      getAccountTransactions: (
        account: string,
        page?: number,
        limit = 1000
      ) => {
        return apiClient.request({
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
