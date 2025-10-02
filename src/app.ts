import express from 'express';
import cors from 'cors';
import '#db';
import { completionsRouter } from '#routes';
import { errorHandler, notFoundHandler } from '#middlewares';

const app = express();
const port = process.env.PORT || '5050';

app.use(cors({ origin: '*' }), express.json());

app.use('/ai', completionsRouter);
app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`\x1b[35mExample app listening at http://localhost:${port}\x1b[0m`)
);
