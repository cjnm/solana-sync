import { Schema, model, type InferSchemaType } from "mongoose";

const transactionHistorySchema = new Schema(
  {
    account: { index: true, type: String },
    standard: { type: String, default: "erc20" }, //spl -> solana, erc20 -> other
    cate_id: Schema.Types.String,
    chain: Schema.Types.String,
    chain_logo: Schema.Types.String,
    tx_hash: String,
    project_id: String,
    receives: [
      {
        amount: Number,
        from_addr: String,
        token_id: String,
      },
    ],
    sends: [
      {
        amount: Number,
        to_addr: String,
        token_id: String,
      },
    ],
    token_approve: [
      {
        spender: String,
        token_id: String,
        value: Number,
      },
    ],
    time_at: { type: Number, index: true },
    tx: {},
    other_addr: String,
    rest: {},
  },
  { timestamps: true }
);

export type SchemaType = InferSchemaType<typeof transactionHistorySchema>;

const TransactionHistory = model<SchemaType>(
  "TransactionHistory",
  transactionHistorySchema
);

export { TransactionHistory };
