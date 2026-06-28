import express from 'express';
import { generateFlashcards, generateQuiz, generateSummary, chat ,explainConcept,getChatHistory } from "../controllers/aiController.js";
import protect from '../middleware/auth.js'
import upload from '../config/multer.js'

const router = express.Router();

//All routes are protected
router.use(protect);


router.get('/', getAllFlashcardSets);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashcard);
router.put('/:cardId/star', toggleStarFlashcard);
router.delete('/:id', deleteFlashcardSet);

export default router;