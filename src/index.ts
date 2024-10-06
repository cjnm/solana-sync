import * as cron from "node-cron";
import { initMongoose } from "./config/mongoose";
import { AccountSyncQueue } from "./models/AccountSyncQueue";
import { saveTokenBalances, saveWalletTransactions } from "./jobs/solana";
import { saveUserChainsBalance } from "./jobs/debank";
import { Account } from "./models/Account";
import type { Types } from "mongoose";

initMongoose();

// Solala Sync
// cron.schedule(
//   "20 * * * * *",
//   async () => {
//     let sync_queue_id: string | Types.ObjectId;
//     try {
//       console.log("running");
//       const syncQueueDetail = await AccountSyncQueue.findOne({
//         standard: "spl",
//         inSync: { $in: [false, null] },
//       }).sort({ updatedAt: 1 });
//       console.log({ syncQueueDetail });

//       if (!syncQueueDetail) return;

//       const { user, account, _id: queue_id } = syncQueueDetail;
//       sync_queue_id = queue_id;

//       // mark account as being synced
//       await AccountSyncQueue.updateOne(
//         { _id: sync_queue_id },
//         {
//           $set: {
//             inSync: true,
//             updatedAt: Date.now(),
//           },
//         }
//       );

//       // get account detail
//       const accountDetail = await Account.findById(account);
//       console.log({ accountDetail });

//       if (!accountDetail) {
//         // mark account as being available for sync
//         await AccountSyncQueue.updateOne(
//           { _id: sync_queue_id },
//           {
//             $set: {
//               inSync: false,
//               updatedAt: Date.now(),
//             },
//           }
//         );
//         return;
//       }

//       const { wallet_address } = accountDetail;

//       //sync start -- token balances
//       await saveTokenBalances(wallet_address, user);

//       // sync start -- wallet transaction
//       await saveWalletTransactions(wallet_address, user);

//       // delete sync queue
//       // await AccountSyncQueue.deleteOne({ _id: sync_queue_id });
//     } catch (err) {
//       await AccountSyncQueue.updateOne(
//         { _id: sync_queue_id },
//         {
//           $set: {
//             inSync: false,
//             updatedAt: Date.now(),
//           },
//         }
//       );

//       console.log(err?.message);
//     }
//   },
//   { runOnInit: true }
// );

// Debank Sync
cron.schedule(
  "1 * * * *",
  async () => {
    // let sync_queue_id: string | Types.ObjectId;
    try {
      console.log("running debank sync");
      await saveUserChainsBalance("0x89f7d3c783e2ec7992d8ba17ca0e3cf0eb4b1c17");
      //   const syncQueueDetail = await AccountSyncQueue.findOne({
      //     standard: "spl",
      //     inSync: { $in: [false, null] },
      //   }).sort({ updatedAt: 1 });
      //   console.log({ syncQueueDetail });

      //   if (!syncQueueDetail) return;

      //   const { user, account, _id: queue_id } = syncQueueDetail;
      //   sync_queue_id = queue_id;

      //   // mark account as being synced
      //   await AccountSyncQueue.updateOne(
      //     { _id: sync_queue_id },
      //     {
      //       $set: {
      //         inSync: true,
      //         updatedAt: Date.now(),
      //       },
      //     }
      //   );

      //   // get account detail
      //   const accountDetail = await Account.findById(account);
      //   console.log({ accountDetail });

      //   if (!accountDetail) {
      //     // mark account as being available for sync
      //     await AccountSyncQueue.updateOne(
      //       { _id: sync_queue_id },
      //       {
      //         $set: {
      //           inSync: false,
      //           updatedAt: Date.now(),
      //         },
      //       }
      //     );
      //     return;
      //   }

      //   const { wallet_address } = accountDetail;

      //   //sync start -- token balances
      //   await saveTokenBalances(wallet_address, user);

      //   // sync start -- wallet transaction
      //   await saveWalletTransactions(wallet_address, user);

      //   // delete sync queue
      //   // await AccountSyncQueue.deleteOne({ _id: sync_queue_id });
    } catch (err) {
      //   await AccountSyncQueue.updateOne(
      //     { _id: sync_queue_id },
      //     {
      //       $set: {
      //         inSync: false,
      //         updatedAt: Date.now(),
      //       },
      //     }
      //   );

      console.log(err?.message);
    }
  },
  { runOnInit: true }
);
