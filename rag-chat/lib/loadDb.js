import { DataAPIClient } from "@datastax/astra-db-ts";
//import { PuppeteerWebBasedLoader } from "langchain/document_loaders/web/puppeteer";

import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

import OpenAI from "openai";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import "dotenv/config";

const {
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_API_ENDPOINT,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const gamepassData = [
  "https://www.metacritic.com/news/xbox-game-pass-library/",
  "https://www.xbox.com/en-US/xbox-game-pass/games",
  "https://www.trueachievements.com/xbox-game-pass/games",
  "https://www.eurogamer.net/xbox-game-pass-games-list-this-month-price-6400",
  "https://docs.google.com/spreadsheets/d/1kspw-4paT-eE5-mrCrc4R9tg70lH2ZTFrJOUmOtOytg/edit?gid=0#gid=0",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT, {
  keyspace: ASTRA_DB_NAMESPACE,
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (similarityMetric = "dot_product") => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 1536,
      metric: similarityMetric,
      /*  type: "openai",
      model: "text-embedding-3-small", */
    },
  });
  console.log("Collection created:", res);
};

const loadSampleData = async () => {
  const collection = db.collection(ASTRA_DB_COLLECTION);
  for await (const url of gamepassData) {
    const content = await scapePage(url);

    const chunks = await splitter.splitText(content);

    for await (const chunk of chunks) {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float",
      });
      const vector = embedding.data[0].embedding;

      const res = await collection.insertOne({
        text: chunk,
        $vector: vector,
      });
      console.log("Inserted chunk:", res);
    }
  }
};

const scapePage = async (url) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });
  return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

createCollection().then(() => {
  loadSampleData();
});
