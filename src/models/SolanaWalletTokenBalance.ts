import mongoose, { Schema, type Document } from "mongoose";

export interface SolanaWalletTokenBalance {
	address: string;
	updated_at: Date;
	next_update_at: Date;
	quote_currency: string;
	chain_id: number;
	chain_name: string;
	items: Item[];
}

export interface Item {
	contract_decimals: number;
	contract_name: string;
	contract_ticker_symbol: string;
	contract_address: string;
	supports_erc: null;
	logo_url: string;
	contract_display_name: string;
	logo_urls: null;
	last_transferred_at: Date;
	native_token: boolean;
	type: string;
	is_spam: boolean;
	balance: string;
	balance_24h: string;
	quote_rate: number;
	quote_rate_24h: number;
	quote: number;
	pretty_quote: string;
	quote_24h: number;
	pretty_quote_24h: string;
	protocol_metadata: null;
	nft_data: null;
}

// Define the schema for the 'Item' type
const ItemSchema: Schema = new Schema({
	contract_decimals: {
		type: Number,
		required: true,
	},
	contract_name: {
		type: String,
		required: true,
	},
	contract_ticker_symbol: {
		type: String,
		required: true,
	},
	contract_address: {
		type: String,
		required: true,
	},
	supports_erc: {
		type: Schema.Types.Mixed,
		default: null,
	},
	logo_url: {
		type: String,
		required: true,
	},
	contract_display_name: {
		type: String,
		required: true,
	},
	logo_urls: {
		type: Schema.Types.Mixed,
		default: null,
	},
	last_transferred_at: {
		type: Date,
		required: true,
	},
	native_token: {
		type: Boolean,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	is_spam: {
		type: Boolean,
		required: true,
	},
	balance: {
		type: String,
		required: true,
	},
	balance_24h: {
		type: String,
		required: true,
	},
	quote_rate: {
		type: Number,
		required: true,
	},
	quote_rate_24h: {
		type: Number,
		required: true,
	},
	quote: {
		type: Number,
		required: true,
	},
	pretty_quote: {
		type: String,
		required: true,
	},
	quote_24h: {
		type: Number,
		required: true,
	},
	pretty_quote_24h: {
		type: String,
		required: true,
	},
	protocol_metadata: {
		type: Schema.Types.Mixed,
		default: null,
	},
	nft_data: {
		type: Schema.Types.Mixed,
		default: null,
	},
});

// Define the schema for the main document
const SolanaWalletTokenBalanceSchema: Schema = new Schema({
	user: { type: String, ref: "User", index: true },
	account: { type: String, ref: "Account", index: true },
	address: {
		type: String,
		required: true,
	},
	updated_at: {
		type: Date,
		required: true,
	},
	next_update_at: {
		type: Date,
		required: true,
	},
	quote_currency: {
		type: String,
		required: true,
	},
	chain_id: {
		type: Number,
		required: true,
	},
	chain_name: {
		type: String,
		required: true,
	},
	items: [ItemSchema], // Embed the ItemSchema for each item in the 'items' array
});

export const SolanaWalletTokenBalanceModel = mongoose.model<
	Document & SolanaWalletTokenBalance
>("SolanaWalletTokenBalance", SolanaWalletTokenBalanceSchema);
