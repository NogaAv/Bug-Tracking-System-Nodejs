import express from 'express';
import * as teamController from '../controllers/team.controller.js';
import authAdmin from '../middlewares/admin.auth.js';

const teamRouter = express.Router();

teamRouter.get('/teams', teamController.getAll);
teamRouter.get('/team/:id', teamController.getTeam);

//Admin operations
teamRouter.post('/team/new', authAdmin, teamController.createTeam);
teamRouter.patch('/team/:id', authAdmin, teamController.updateTeam);
teamRouter.delete('/team/:id', authAdmin, teamController.deleteTeam);

export default teamRouter;
