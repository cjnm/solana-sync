import "dotenv/config";
const { env } = process;

const _ = {
  GOLD_RUSH_API_KEY: env.GOLD_RUSH_API_KEY,
  SOLANAFM_API_KEY: env.SOLANAFM_API_KEY,
  DEBANK_ACCESS_KEY: env.DEBANK_ACCESS_KEY,
  mongo: {
    uri: process.env.MONGODB_URI,
  },
};

export default _;
