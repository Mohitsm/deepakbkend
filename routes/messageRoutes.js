import express from 'express';
import {
  createMessage,
  getAllMessages,
  getMessage,
  updateMessage,
  deleteMessage,
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/', getAllMessages);
router.get('/:id', getMessage);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router;
