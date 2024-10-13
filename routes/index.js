import { Router } from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js';
import NotesController from '../controllers/NotesController.js';

const router = Router();
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/users', UsersController.registerUser);

router.get('/login', AuthController.loginUser);
router.get('/logout', AuthController.logoutUser);
router.get('/users/get', UsersController.getUser);

router.post('/notes', NotesController.createNote);
router.get('/notes/:id', NotesController.readNote);
// router.put('/notes/:id', NotesController.updateNote);
// router.delete('/notes/:id', NotesController.deleteNote);

export default router;
