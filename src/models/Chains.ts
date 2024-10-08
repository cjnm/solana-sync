import { Schema, model, type InferSchemaType } from "mongoose";

const chainsSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    standard: { type: String, default: "erc20" }, //spl -> solana, erc20 -> other
    timestamp: { type: Date, default: new Date() },
    native_token_id: { type: String, required: true },
    born_at: Number,
    logo_url: String,
    usd_value: Number,
    wrapped_token_id: String,
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    metadata: {
      community_id: { type: Number, required: true },
      wallet_address: String,
      user: { type: String, ref: "User", index: true },
    },
  },
  {
    timestamps: true,
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "minutes",
    },
  }
);

type SchemaType = InferSchemaType<typeof chainsSchema>;

const Chain = model<SchemaType>("Chain", chainsSchema);

export { Chain };
