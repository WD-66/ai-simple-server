import type { RequestHandler } from 'express';
import type { ChatCompletionMessageParam } from 'openai/resources';
import type { z } from 'zod';
import type { promptBodySchema } from '#schemas';
import OpenAI from 'openai';
import { isValidObjectId } from 'mongoose';
import { Chat } from '#models';

type IncomingPrompt = z.infer<typeof promptBodySchema>;
type ResponseCompletion = { completion: string };
type ResponseWithId = ResponseCompletion & { chatId: string };

// declared outside of function, to persist across API calls. Will reset if server stops/restarts
const messages: ChatCompletionMessageParam[] = [
  { role: 'developer', content: 'You are a helpful assistant' }
];

export const createSimpleChatCompletion: RequestHandler<
  unknown,
  ResponseCompletion,
  IncomingPrompt
> = async (req, res) => {
  const { prompt } = req.body;

  const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env?.AI_URL
  });

  messages.push({ role: 'user', content: prompt });

  const completion = await client.chat.completions.create({
    model: process.env.AI_MODEL || 'gemini-2.0-flash',
    messages
  });

  const completionText = completion.choices[0]?.message.content || 'No completion generated';

  messages.push({ role: 'assistant', content: completionText });

  res.json({ completion: completionText });
};
export const createChatCompletion: RequestHandler<unknown, ResponseWithId, IncomingPrompt> = async (
  req,
  res
) => {
  const { prompt, chatId } = req.body;

  // find chat in database
  let currentChat = await Chat.findById(chatId);
  // if no chat is found, create a chat with system prompt
  if (!currentChat) {
    const systemPrompt = { role: 'developer', content: 'You are a helpful assistant' };
    currentChat = await Chat.create({ history: [systemPrompt] });
  }

  // add user message to database history
  currentChat.history.push({
    role: 'user',
    content: prompt
  });

  const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env?.AI_URL
  });

  const completion = await client.chat.completions.create({
    model: process.env.AI_MODEL || 'gemini-2.0-flash',
    // stringifying and then parsing is like using .lean(). It will turn currentChat into a plain JavaScript Object
    // We don't use .lean(), because we later need to .save()
    messages: JSON.parse(JSON.stringify(currentChat.history))
  });

  const completionText = completion.choices[0]?.message.content || 'No completion generated';

  currentChat.history.push({ role: 'assistant', content: completionText });

  await currentChat.save();

  res.json({ completion: completionText, chatId: currentChat._id.toString() });
};

export const getChatHistory: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: { status: 400 } });

  const chat = await Chat.findById(id);

  if (!chat) throw new Error('Chat not found', { cause: { status: 404 } });

  res.json(chat);
};
