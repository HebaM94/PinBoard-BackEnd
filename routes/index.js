import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import NotesController from '../controllers/NotesController';

const router = Router();
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/register', UsersController.registerUser);

router.post('/login', AuthController.loginUser);
router.get('/logout', AuthController.logoutUser);
router.get('/users/get', UsersController.getUser);

router.post('/notes', AuthController.authMiddleware, NotesController.createNote);
router.get('/notes/:id', AuthController.authMiddleware, NotesController.readNote);
router.put('/notes/:id', AuthController.authMiddleware, NotesController.updateNote);
router.delete('/notes/:id', AuthController.authMiddleware, NotesController.deleteNote);

export default router;
