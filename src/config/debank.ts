import env from "./env";
import axios from "axios";

const { DEBANK_ACCESS_KEY } = env;

if (!DEBANK_ACCESS_KEY) throw new Error("Invalid solana.fm API Key");

const debankProBaseUrl = "https://pro-openapi.debank.com";

const Debank = () => {
  axios.defaults.baseURL = debankProBaseUrl;
  axios.defaults.headers.common.AccessKey = DEBANK_ACCESS_KEY;

  return {
    // get user chains
    ChainsService: {
      getUserChains: (id: string) => {
        return axios.request({
          method: "GET",
          url: "v1/user/used_chain_list",
          params: { id },
        });
      },

      // get user chain usd value
      getUserChainBalance: (id: string, chain_id: string) => {
        return axios.request({
          method: "GET",
          url: "v1/user/chain_balance",
          params: { id, chain_id },
        });
      },
    },
  };
};

export default Debank;
