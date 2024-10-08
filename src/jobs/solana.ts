import { SolanaWalletTokenBalanceModel } from "../models/SolanaWalletTokenBalance";
import {
  getTokenBalances,
  getAccountTransactions,
  getTransactionDetails,
} from "../controllers/Solana";
import { SolanaAccountTransactionsModel } from "../models/SolanaAccountTransactions";
import { SolanaTransactionDetailsModel } from "../models/SolanaTransactionDetails";
import { AccountTotalBalance } from "../models/AccountTotalBalance";
import { Account } from "../models/Account";
import { TransactionHistory } from "../models/TransactionHistory";
import { Chain } from "../models/Chains";
import { Token } from "../models/Token";

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
    }
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
    }
  );
  console.log("token balance saved");

  // Save tokens - backward compactable
  await Promise.all(
    tokenBalance.data.items.map((item) => {
      return Token.findOneAndUpdate(
        { account: address },
        {
          user,
          account: address,
          token_id: item.contract_address,
          chain: "solana-mainnet",
          name:
            item.contract_name ||
            item.contract_display_name ||
            item.contract_address,
          symbol:
            item.contract_name ||
            item.contract_display_name ||
            item.contract_address,
          display_symbol:
            item.contract_name ||
            item.contract_display_name ||
            item.contract_address,
          optimized_symbol:
            item.contract_name ||
            item.contract_display_name ||
            item.contract_address,
          decimals: item.contract_decimals,
          logo_url: item.logo_url || item.logo_urls.token_logo_url,
          is_verified: !item.is_spam,
          price: item.quote_rate,
          standard: "spl",
          time_at: 0,
          amount: Number(item.balance || 0),
          raw_amount: Number(item.balance || 0),
          total_usd_price: item.quote,
          sync_time: 1,
        },
        {
          upsert: true,
        }
      );
    })
  ).catch((err) => console.log("Error Saving Solana Token", err));

  // saving aggregate balance
  const total_balance = tokenBalance.data.items.reduce((total, datum) => {
    return total + datum.quote;
  }, 0);

  await AccountTotalBalance.findOneAndUpdate(
    { account: address },
    { amount: total_balance, user, account: address, sync_time: 1 },
    {
      upsert: true,
    }
  );

  // save Solana chain details
  const chainData = {
    id: "solana-mainnet",
    name: "Solana",
    logo_url:
      "https://www.datocms-assets.com/86369/1670614895-solana-icon-white.svg",
    timestamp: new Date(),
    usd_value: total_balance,
    native_token_id: "solana-mainnet",
    standard: "spl", //spl -> solana, erc20 -> other
    metadata: {
      user,
      community_id: 1399811149,
      wallet_address: address,
    },
  };
  await Chain.insertMany([chainData]).catch((err) =>
    console.log("error saving solana chain details", err)
  );
};

const saveWalletTransactions = async (
  solanaWalletAddress: string,
  user: string
) => {
  const accounts = await Account.findOne({
    wallet_address: solanaWalletAddress,
  }).catch((error) => {
    throw new Error(error);
  });

  const transactions = await getAccountTransactions(solanaWalletAddress).catch(
    (error) => {
      throw new Error(`Error getting transaction: ${error}`);
    }
  );

  if (transactions.status !== "success")
    throw new Error(`transaction error ${transactions.message}`);

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
    (item: transaction) => item.signature
  );

  while (tx_hashes.length > 0) {
    const chunk = tx_hashes.slice(0, 50); // Get the first 50 elements
    tx_hashes.splice(0, 50); // Remove the first 50 elements

    const transactionDetails = await getTransactionDetails(chunk).catch(
      (error) => {
        throw new Error(`Error getting transaction details ${error}`);
      }
    );

    if (transactionDetails.status !== "success")
      throw new Error(`Transaction detail error ${transactionDetails.message}`);

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

    // prepare transaction history bulk write - backward compactibility

    // Prepare bulk operations
    const __bulkOps = transactionDetails.result.map((transaction: any) => ({
      updateOne: {
        filter: { tx_hash: transaction.transactionHash },
        update: {
          $set: {
            user,
            account: solanaWalletAddress,
            chain: "solana",
            chain_name: "Solana",
            chain_logo:
              "https://www.datocms-assets.com/86369/1670614895-solana-icon-white.svg",
            standard: "spl", //spl -> solana, erc20 -> other
            time_at: transaction?.data[0]?.timestamp || "",
            tx_hash: transaction.transactionHash,
            account_id: accounts._id,
            account_name: accounts.name,
            account_color: accounts.account_color,
            quantity: 0,
            tx: {
              name: "",
            },
          },
        },
        upsert: true,
      },
    }));

    // Execute bulkWrite
    TransactionHistory.bulkWrite(__bulkOps)
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
