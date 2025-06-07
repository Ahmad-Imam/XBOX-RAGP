# XBOX RAGP

## Welcome to XBOX RAGP.

Live: https://xbox-ragp.vercel.app/

The live chatbot link might not always give results because of expired Open AI credit or Astra Db being idle due to inactivity. Kindly view the demo video to preview the application

## Information

XBOX RAGP, built with Next.js and AI SDK is a simple chatbot utilizing LLM and RAG to get information about the latest information regarding xbox gamepass subscriptions. It uses Astra DataStax to store vector embeddings and utilizes OPEN AI Vector embedding model to create them.

The LLM model used is GPT-4.1-nano which has an knowledge cutoff of June, 2024. By utilizing RAG, the model is capable of answering questions and providing updates up to May, 2025. Whenever new information is there you just need to add the urls in the loadDB file and run the seed command to get the latest context.

## Frontend Instructions

1. Run npm run seed to create vector embeddings and create context for your information.
2. Run npm install --legacy-peer-deps (Some package version conflict with React 19 and Next.js 15)
3. Run npm run dev
4. Enjoy !!!

## Application Features

1. Get informations about xbox gamepass subscriptions

2. Update information according to your needs

3. You can customize the chatbot to provide information and updates about anything, not just xbox gamepass.

## Demo

https://github.com/user-attachments/assets/94cf1cbc-a772-4b55-99c9-27933c49407e

## Sample Screenshots

| <img src="https://github.com/user-attachments/assets/0cfa495e-435e-4a18-b541-ac34c1a43845" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                   _HOME SCREEN_                                                    |
