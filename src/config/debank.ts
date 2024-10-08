import env from "./env";
import axios from "axios";

const { DEBANK_ACCESS_KEY } = env;

if (!DEBANK_ACCESS_KEY) throw new Error("Invalid solana.fm API Key");

const debankProBaseUrl = "https://pro-openapi.debank.com";

const Debank = () => {
  const apiClient = axios.create({
    baseURL: debankProBaseUrl,
    headers: {
      AccessKey: DEBANK_ACCESS_KEY,
    },
  });

  return {
    // get user chains
    ChainsService: {
      getUserChains: (id: string) => {
        return apiClient.request({
          method: "GET",
          url: "v1/user/used_chain_list",
          params: { id },
        });
      },

      // get user chain usd value
      getUserChainBalance: (id: string, chain_id: string) => {
        return apiClient.request({
          method: "GET",
          url: "v1/user/chain_balance",
          params: { id, chain_id },
        });
      },
    },
  };
};

export default Debank;
