import mongoose, { Schema, type Document } from "mongoose";

export type SolanaTransactionDetails = {
	transactionHash: string;
	data: [
		{
			instructionIndex: number;
			innerInstructionIndex: number;
			action: string;
			status: string;
			source: string;
			sourceAssociation: null;
			destination: null;
			destinationAssociation: null;
			token: string;
			amount: number;
			timestamp: number;
		},
	];
};

// Define the schema for the 'data' array items
const DataSchema: Schema = new Schema({
	instructionIndex: {
		type: Number,
		required: true,
	},
	innerInstructionIndex: {
		type: Number,
		required: true,
	},
	action: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	source: {
		type: String,
		required: true,
	},
	sourceAssociation: {
		type: Schema.Types.Mixed,
		default: null,
	},
	destination: {
		type: Schema.Types.Mixed,
		default: null,
	},
	destinationAssociation: {
		type: Schema.Types.Mixed,
		default: null,
	},
	token: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	timestamp: {
		type: Number,
		required: true,
	},
});

// Define the schema for the main document
const SolanaTransactionDetailsSchema: Schema = new Schema({
	user: { type: String, ref: "User", index: true },
	account: { type: String, ref: "Account", index: true },
	transactionHash: {
		type: String,
		required: true,
	},
	data: [DataSchema], // Embed the DataSchema for each item in the 'data' array
});

export const SolanaTransactionDetailsModel =
	mongoose.model<SolanaTransactionDetails>(
		"SolanaTransactionDetails",
		SolanaTransactionDetailsSchema,
	);
