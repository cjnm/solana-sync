import env from "./env";
import mongoose from "mongoose";

const {
	mongo: { uri },
} = env;

mongoose.Promise = global.Promise;

mongoose.connection.on("error", (err) => {
	console.error(`MongoDB Connection Error ${err}`);
});

mongoose.connection.on("connected", () => {
	console.info("Connected To DB");
});

/**
 * Connect to mongo db
 *
 * @public
 */
export async function initMongoose() {
	await mongoose.connect(uri);
}
