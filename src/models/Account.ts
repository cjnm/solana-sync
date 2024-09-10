import type { NextFunction } from "express";
import { Schema, model, type InferSchemaType } from "mongoose";

const accountSchema = new Schema(
	{
		name: { type: String, required: true },
		account_color: { type: String, default: "#CCCCCC" },
		account_type: { type: String, required: true },
		cefi_account_provider: String,
		description: String,
		api_key: String,
		hashed_api_key: String,
		wallet_address: String,
		type: String,
		category: String,
		tags: String,
		standard: String,
		slug: { type: String, unique: true, index: true },
		field_label: String,
		balance_on_date_added: String,
		user: { type: String, ref: "User", index: true },
		status: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		deletedAt: Number,
		capitalized_name: String,
	},
	{ timestamps: true },
);

accountSchema.pre("save", async function (next: NextFunction) {
	this.capitalized_name = this.name.toUpperCase();
	next();
});

type SchemaType = InferSchemaType<typeof accountSchema>;

const Account = model<SchemaType>("Account", accountSchema);

export { Account };
