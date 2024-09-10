import { Schema, model, type InferSchemaType } from "mongoose";

const AccountSyncQueueSchema = new Schema(
	{
		user: { type: String, ref: "User", index: true },
		account: { type: String, ref: "Account", index: true },
		type: {
			type: String,
			enum: ["defi", "cefi"],
			default: "defi",
		},
		standard: String,
		inSync: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

type SchemaType = InferSchemaType<typeof AccountSyncQueueSchema>;

const AccountSyncQueue = model<SchemaType>(
	"AccountSyncQueue",
	AccountSyncQueueSchema,
);

export { AccountSyncQueue };
