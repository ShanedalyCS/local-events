// routes/users.js
import { Router } from 'express';
import { users } from '../controller/userController.js';

const router = Router();
router.get('/users', users); // GET /users

export default router;
