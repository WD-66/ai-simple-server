import { Router } from 'express';
import { createSimpleChatCompletion, createChatCompletion, getChatHistory } from '#controllers';
import { validateBodyZod } from '#middlewares';
import { promptBodySchema } from '#schemas';

const completionsRouter = Router();
completionsRouter.get('/history/:id', getChatHistory);

completionsRouter.use(validateBodyZod(promptBodySchema));
completionsRouter.post('/simple-chat', createSimpleChatCompletion);
completionsRouter.post('/chat', createChatCompletion);

export default completionsRouter;
