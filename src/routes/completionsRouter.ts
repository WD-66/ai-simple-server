import { Router } from 'express';
import { createSimpleChatCompletion, createChatCompletion } from '#controllers';
import { validateBodyZod } from '#middlewares';
import { promptBodySchema } from '#schemas';

const completionsRouter = Router();
completionsRouter.use(validateBodyZod(promptBodySchema));

completionsRouter.post('/simple-chat', createSimpleChatCompletion);
completionsRouter.post('/chat', createChatCompletion);

export default completionsRouter;
