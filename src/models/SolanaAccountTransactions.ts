import mongoose, { Schema, type Document } from "mongoose";

export interface SolanaAccountTransactions extends Document {
	blockTime: number;
	confirmationStatus: string;
	err: null;
	memo: null;
	signature: string;
	slot: number;
}

const SolanaAccountTransactionsSchema: Schema = new Schema({
	blockTime: {
		type: Number,
		required: true,
	},
	confirmationStatus: {
		type: String,
		required: true,
	},
	err: {
		type: Schema.Types.Mixed,
		default: null,
	},
	memo: {
		type: Schema.Types.Mixed,
		default: null,
	},
	signature: {
		type: String,
		required: true,
	},
	slot: {
		type: Number,
		required: true,
	},
});

export const SolanaAccountTransactionsModel =
	mongoose.model<SolanaAccountTransactions>(
		"SolanaAccountTransactions",
		SolanaAccountTransactionsSchema,
	);
