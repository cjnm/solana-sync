import * as cron from "node-cron";
import { initMongoose } from "./config/mongoose";
import { AccountSyncQueue } from "./models/AccountSyncQueue";
import { saveTokenBalances, saveWalletTransactions } from "./jobs/solana";
import { saveUserChainsBalance } from "./jobs/debank";
import { Account } from "./models/Account";
import type { Types } from "mongoose";

initMongoose();

// Solala Sync
cron.schedule(
  "20 * * * * *",
  async () => {
    let sync_queue_id: string | Types.ObjectId;
    try {
      console.log("solana - running");
      const syncQueueDetail = await AccountSyncQueue.findOne({
        standard: "spl", //spl -> solana, erc20 -> other
        inSync: { $in: [false, null] },
      }).sort({ updatedAt: 1 });
      console.log({ solanaSyncQueueDetail: syncQueueDetail });

      if (!syncQueueDetail) return;

      const { user, account, _id: queue_id } = syncQueueDetail;
      sync_queue_id = queue_id;

      // mark account as being synced
      await AccountSyncQueue.updateOne(
        { _id: sync_queue_id },
        {
          $set: {
            inSync: true,
            updatedAt: Date.now(),
          },
        }
      );

      // get account detail
      const accountDetail = await Account.findById(account);
      console.log({ accountDetail });

      if (!accountDetail) {
        // mark account as being available for sync
        await AccountSyncQueue.updateOne(
          { _id: sync_queue_id },
          {
            $set: {
              inSync: false,
              updatedAt: Date.now(),
            },
          }
        );
        return;
      }

      const { wallet_address } = accountDetail;

      //sync start -- token balances
      await saveTokenBalances(wallet_address, user);

      // sync start -- wallet transaction
      await saveWalletTransactions(wallet_address, user);

      // delete sync queue
      // await AccountSyncQueue.deleteOne({ _id: sync_queue_id });
    } catch (err) {
      await AccountSyncQueue.updateOne(
        { _id: sync_queue_id },
        {
          $set: {
            inSync: false,
            updatedAt: Date.now(),
          },
        }
      );

      console.log(err?.message);
    }
  },
  { runOnInit: true }
);

// Debank Sync
cron.schedule(
  "20 * * * * *",
  async () => {
    let sync_queue_id: string | Types.ObjectId;
    try {
      console.log("debank - running");
      const syncQueueDetail = await AccountSyncQueue.findOne({
        standard: "erc20", //spl -> solana, erc20 -> other
        inSync: { $in: [false, null] },
      }).sort({ updatedAt: 1 });
      console.log({ debankSyncQueueDetail: syncQueueDetail });

      if (!syncQueueDetail) return;

      const { user, account, _id: queue_id } = syncQueueDetail;
      sync_queue_id = queue_id;

      // mark account as being synced
      await AccountSyncQueue.updateOne(
        { _id: sync_queue_id },
        {
          $set: {
            inSync: true,
            updatedAt: Date.now(),
          },
        }
      );

      // get account detail
      const accountDetail = await Account.findById(account);
      console.log({ accountDetail });

      if (!accountDetail) {
        // mark account as being available for sync
        await AccountSyncQueue.updateOne(
          { _id: sync_queue_id },
          {
            $set: {
              inSync: false,
              updatedAt: Date.now(),
            },
          }
        );
        return;
      }

      const { wallet_address } = accountDetail;

      // Sync chains
      await saveUserChainsBalance(wallet_address, user);

      // delete sync queue
      // await AccountSyncQueue.deleteOne({ _id: sync_queue_id });
    } catch (err) {
      await AccountSyncQueue.updateOne(
        { _id: sync_queue_id },
        {
          $set: {
            inSync: false,
            updatedAt: Date.now(),
          },
        }
      );

      console.log(err?.message);
    }
  },
  { runOnInit: true }
);
