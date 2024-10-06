import type { Chains } from "chains";
import Debank from "../config/debank";

const debank = Debank();

export const getUserChainsBalance = async (walletAddress: string) => {
  if (!walletAddress) throw new Error("WalletAddress not found");

  try {
    const userChains = await (
      await debank.ChainsService.getUserChains(walletAddress)
    ).data;

    if (Array.isArray(userChains) && userChains.length > 0) {
      const chainDataPromises = userChains.map(async (userChain: Chains) => {
        const { data: value } = await debank.ChainsService.getUserChainBalance(
          walletAddress,
          userChain.id
        );

        return {
          ...userChain,
          usd_value: value.usd_value,
        };
      });

      return await Promise.all(chainDataPromises);
    }
  } catch (err) {
    throw new Error(err);
  }
};
