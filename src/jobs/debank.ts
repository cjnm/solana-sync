import { Chain } from "../models/Chains";
import { getUserChainsBalance } from "../controllers/Debank";
// import { data } from "../../data";

const saveUserChainsBalance = async (wallet_address: string, user: string) => {
  const userChainsBalances = await getUserChainsBalance(wallet_address);
  // const userChainsBalances = data;
  if (!userChainsBalances) return;
  const timestamp = new Date();
  // Insert into the time series collection
  if (userChainsBalances.length > 0) {
    try {
      const chainData = userChainsBalances.map((userChainsBalance) => {
        const {
          id,
          name,
          born_at,
          logo_url,
          usd_value,
          community_id,
          native_token_id,
          wrapped_token_id,
        } = userChainsBalance;

        return {
          id,
          name,
          born_at,
          logo_url,
          timestamp,
          usd_value,
          native_token_id,
          wrapped_token_id,
          standard: "erc20",
          metadata: {
            user,
            community_id,
            wallet_address,
          },
        };
      });

      console.log({ chainData });
      await Chain.insertMany(chainData).catch((err) => console.log(err));
      console.log("Data successfully inserted into time series collection.");
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  }
};

export { saveUserChainsBalance };
