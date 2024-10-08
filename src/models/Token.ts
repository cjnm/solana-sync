import { Schema, model, type InferSchemaType } from "mongoose";

const tokenSchema = new Schema({
  user: { type: String, ref: "User", index: true },
  account: { type: String, required: true, index: true },
  standard: { type: String, default: "erc20" },
  token_id: String,
  chain: String,
  name: String,
  symbol: String,
  display_symbol: String,
  optimized_symbol: String,
  decimals: Number,
  logo_url: String,
  is_verified: Boolean,
  is_core: Boolean,
  price: Number,
  time_at: Number,
  amount: Number,
  raw_amount: Number,
  total_usd_price: Number,
  sync_time: { type: Number, default: 1 },
  prices_comparison: {},
  price_information: {},
});

type SchemaType = InferSchemaType<typeof tokenSchema>;

const Token = model<SchemaType>("Tokens", tokenSchema);

export { Token };
