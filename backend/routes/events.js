import { Router } from 'express';
import { list } from '../controller/eventsController.js';

const router = Router();
router.get('/', list); // GET /events
export default router;
