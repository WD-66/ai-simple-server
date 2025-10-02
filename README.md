# A simple server for working with OpenAI's Chat Completions API (compatible with most LLMs)

This project provides a simple server for Gemini API requests, allowing you to manage API requests and responses, and get the chat history.

## Installation

- Fork and Clone this project

- Install dependencies:
  - Note we are using Zod v3 for compatibility with structured outputs

```bash
npm install
```

### Get an LLM API Key

This API is compatible with OpenAI, Gemini, and Anthropic API keys

### Continue project Setup

- Rename `example.env.development.local` to `.env.development.local` and add your variables. An example with Gemini could look like this

```
AI_API_KEY=asdfhlweuilsadflkjsf
AI_MODEL=gemini-2.0-flash
AI_URL=https://generativelanguage.googleapis.com/v1beta/openai/
MONGO_URI=mongodb+srv://someuser:somepassowrd@someproject.4328sadf3.mongodb.net/
```

- Run

```bash
npm run dev
```

## Endpoints

Currently, this API supports

- Simple Chat: `POST` `/ai/simple-chat`
  - A basic implementation, holds the chat history in memory
- Chat: `POST` `/ai/chat`
  - Chat history is stored in a MongoDB database
- Get Chat History: `GET` `/ai/history/:id`
  - Get full chat history from database

## Sample request

### Simple Chat and Chat Body

```json
{
  "prompt": "How do I save to local storage?",
  "chatId": "6849725aa34cc4996b4ea6ee" // not available on simple chat, optional on chat
}
```

## Server setup checklist

### `POST` `/ai/simple-chat`

- Make a request to this endpoint
- Look at the `createSimpleChatCompletion` function in `controllers/completions.ts`
- Update the `content` of the `developer` message to change the "voice" of the AI assistant
- Note the structure of the `messages` variable

### `POST` `/ai/chat`

- Make a request to this endpoint
- Note the shape of the `Chat` model found in `/models/Chat.ts`
- Compare the flow to the `createSimpleChat` controller. What has been added/changed to allow database storage?
- Create a chat, and include the `chatId` in the body of subsequent requests
- Open Mongo Compass, and see what gets stored when you save a chat
- Make note of the additional comments

### `GET` `/ai/history/:id`

- Make a request to this endpoint, and take note of the structure of the body
- Look closely at how the objects in the `history` are structured.
