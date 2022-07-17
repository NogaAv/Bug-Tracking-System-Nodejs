import express from 'express';
import * as projectController from '../controllers/project.controller.js';
import authUser from '../middlewares/user.auth.js';
import authAdmin from '../middlewares/admin.auth.js';

const projectRouter = express.Router();

projectRouter.get('/projects', projectController.getAll);
projectRouter.get('/projects/:id', projectController.getProject);

projectRouter.patch('/project/:id', authUser, projectController.updateProject);

//Admin operations
projectRouter.post('/project/new', authAdmin, projectController.createProject);
projectRouter.patch('/project/:id', authAdmin, projectController.assignTeamToProject);
projectRouter.delete('/project/:id', authAdmin, projectController.deleteProject);

export default projectRouter;
