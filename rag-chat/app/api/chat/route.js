import { DataAPIClient } from "@datastax/astra-db-ts";
import { embed, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 30;

const {
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_API_ENDPOINT,

} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {
  keyspace: ASTRA_DB_NAMESPACE,
});


export async function POST(req) {
  try {
    const { messages } = await req.json();

    const latestMessage = messages[messages.length - 1]?.content;

    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: latestMessage,
    });
  
    let docContext = "";
    try {
      const collection = db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find(null, {
        sort: {
          $vector: embedding,
        },
        limit: 100,
      });

      const documents = await cursor.toArray();
      const docsMap = documents?.map((doc) => doc.text);
      docContext = JSON.stringify(docsMap);
    } catch (e) {
      console.error("Error creating embeddings:", e);
    }

    const template = {
      role: "system",
      content: `You are an ai assistant who specializes in everything about xbox gamepass. 
        Use the below context to answer the user's question: 
        The context provides the latest information about xbox gamepass games,
        including release dates, availability, and other relevant details.
        If the context doesnt include the answer, then answer based on your existing knowledge
         and dont mention source of information or what the context does or does not include.
    Format responses using markdown where applicable and dont return images. 
    
    -----
    START CONTEXT
    ${docContext}
    END CONTEXT
    -----

    QUESTION: ${latestMessage}
    -------
        `,
    };


    const result = streamText({
      model: openai("gpt-4.1-nano"),
      system: `You are an AI assistant who specializes in everything about Xbox Game Pass. Use the provided context to answer the user's question. If the context does not include the answer, respond based on your existing knowledge without mentioning the source of information or what the context does or does not include. Format responses using markdown where applicable and do not return images.`,
      prompt: template.content,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
