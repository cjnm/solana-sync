import { Schema, model, type InferSchemaType } from "mongoose";

const AccountTotalBalanceSchema = new Schema({
	user: { type: String, ref: "User", index: true },
	account: { type: String, index: true },
	liquid_balance: Number,
	staked_balance: Number,
	amount: Number,
	sync_time: Number,
});

export type SchemaType = InferSchemaType<typeof AccountTotalBalanceSchema>;

const AccountTotalBalance = model<SchemaType>(
	"AccountTotalBalance",
	AccountTotalBalanceSchema,
);

export { AccountTotalBalance };
