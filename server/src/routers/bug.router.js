import express from 'express';
import * as bugController from '../controllers/bug.controller.js';
import authUser from '../middlewares/user.auth.js';
import authAdmin from '../middlewares/admin.auth.js';

const bugRouter = express.Router();

bugRouter.get('/bugs', bugController.getAll);
bugRouter.get('/bugs/:projectId', bugController.getBugsByProject);
bugRouter.get('/bug/:id', bugController.getBug);

bugRouter.post('/bug/new', authUser, bugController.createBug);
bugRouter.patch('/bug/:id', authUser, bugController.updateBug);

//Admin operations
bugRouter.patch('/bug/:id', authAdmin, bugController.assignBug);
bugRouter.delete('/bug/:id', authAdmin, bugController.deleteBug);

export default bugRouter;
