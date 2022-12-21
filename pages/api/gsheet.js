// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GoogleSpreadsheet } from "google-spreadsheet";

const connectToGSheet = async () => {
  const doc = new GoogleSpreadsheet(
    "1NVzJ5h8plgn7EgJqWCPPe1MX15DdlFAZCbrNuDyVRzw"
  );

  // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    // env var values are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
      /\\n/g,
      "\n"
    ),
  });
  return doc;
};

export default async function handler(req, res) {
  let shoes = [];
  const { query } = req;

  if (!query?.search) return res.status(200).json([]);

  const searchQuery = query.search.toLowerCase();

  const doc = await connectToGSheet();
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  const rows = await sheet.getRows(); // can pass in { limit, offset }

  rows.forEach((row) => {
    if (row.Shoe && row.Sold === "FALSE") {
      shoes.push({
        sku: row.Sku,
        name: row.Shoe,
        sold: row.Sold,
        size: row.Size,
        price: row.Cost,
        image: row.Image,
      });
    }
  });

  if (!searchQuery) return res.status(200).json(shoes);

  shoes = shoes.filter((shoe) => shoe.name.toLowerCase().includes(searchQuery));

  return res.status(200).json(shoes);
}