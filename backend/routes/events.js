import { Router } from 'express';
import { list } from '../controller/eventsController.js';
import { listID } from '../controller/eventsController.js'

const router = Router();
router.get('/', list); // GET /events


router.get('/:id', listID);
export default router;
