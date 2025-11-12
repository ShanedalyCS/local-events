//import libraries needed
import express from 'express';
import axios from 'axios';
import {supabase} from './supabaseClient.js';
import 'dotenv/config';

import eventsRouter from './routes/events.js';

import cors from "cors";

const app = express();
const port = 3000; 
//common port, if there are issues, mention it on teams and it will be changed 

app.use('/events', eventsRouter);   // ← mounts GET /events

app.get('/', (_, res) => res.send('Local Events API'));

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`Local Events backend is running on port ${port}`);
})