// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import eventsRouter from './routes/events.js';
import usersRouter from './routes/userRoute.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount routers
app.use('/events', eventsRouter);
app.use('/users', usersRouter);

app.get('/', (_, res) => res.send('Local Events API'));

app.listen(port, () => {
  console.log(`Local Events backend is running on port ${port}`);
});
