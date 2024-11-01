import { getAmazonClient } from "@/libs/AmazonClient/index.js";

const test = async () => {
  const amazonClient = getAmazonClient();

  try {
    await amazonClient.getAmazonProductDetails({ asin: "B0D97XRSZ3" });
  } catch (err: any) {
    console.error({ err });
  }
  process.exit(0);
};

test();
