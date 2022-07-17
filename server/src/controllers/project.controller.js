import { SuccessResponse, ErrorResponse } from '../models/response.model.js';
import Project from '../models/project.model.js';
import Team from '../models/team.model.js';

export const getAll = async (req, res, next) => {
    try {
        const projects = await Project.find();
        res.status(200).send(
            new SuccessResponse(200, 'Ok', 'Retrieved all projects in DB successfully', { projects: projects })
        );
    } catch (err) {
        next(err);
    }
};

export const getProject = async (req, res, next) => {
    const projectID = req.params.id;
    if (!projectID) {
        res.status(400).send(new ErrorResponse(400, 'Invalid request', 'Project id is missing in the request'));
        return;
    }
    try {
        const project = await Project.findById(projectID);
        if (!project) {
            res.status(400).send(new ErrorResponse(400, 'Invalid request', 'Project id is not found in DB'));
            return;
        }
        res.status(200).send(new SuccessResponse(200, 'Ok', 'Retrieved project successfully', { project: project }));
    } catch (err) {
        next(err);
    }
};

export const updateProject = async (req, res, next) => {
    const projectID = req.params.id;
    const updatedData = req.body;

    //Team assignment can only be done by Admin
    if (updatedData.teamID) delete updatedData.teamID;

    try {
        await Project.findByIdAndUpdate(projectID, updatedData);
        res.status(200).send(new SuccessResponse(200, 'Ok', 'Updated project successfully', {}));
    } catch (err) {
        next(err);
    }
};

export const assignTeamToProject = async (req, res, next) => {
    const projectID = req.params.id;
    const teamId = req.body.teamID;
    if (!projectID || !teamId) {
        res.status(400).send(
            new ErrorResponse(400, 'Invalid request', 'Project id and Team id are required to be sent in request')
        );
        return;
    }
    try {
        await Project.findByIdAndUpdate(projectID, { teamID: teamId });
        res.status(200).send(new SuccessResponse(200, 'Ok', 'Assigned team to project successfully', {}));
    } catch (err) {
        next(err);
    }
};

export const createProject = async (req, res, next) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();

        res.status(201).send(new SuccessResponse(201, 'Created', 'New Project created', { project: newProject }));
    } catch (err) {
        next(err);
    }
};

//Project can be deleted only if no bug is referencing it.
//Also, deletion of the project must be followed by removing the project reference in the Team referencing it
export const deleteProject = async (req, res, next) => {
    const projectID = req.params.id;
    if (!projectID) {
        res.status(400).send(new ErrorResponse(400, 'Bad Request', 'Project _id is missing from request.'));
        return;
    }

    try {
        const projectToDelete = await Project.findById(projectID);
        if (!projectToDelete) {
            res.status(400).send(new ErrorResponse(400, 'Bad Request', 'Project not found in DB.'));
            return;
        }
        await projectToDelete.populate('bugs');

        if (projectToDelete.bugs && projectToDelete.bugs.length > 0) {
            res.status(400).send(
                new ErrorResponse(
                    400,
                    'Bad Request',
                    'Failed to delete: Cannot delete project that is referenced by any Bug doc. Delete or re-assign bugs before attempting to delete the project.'
                )
            );

            return;
        }

        const delResult = await Project.deleteOne({ _id: projectID });
        if (delResult.deletedCount !== 1) {
            const msg =
                delResult.deletedCount === 0
                    ? 'Project id does not exist in DB'
                    : `Deletion count operation returned: ${delResult.deletedCount}`;

            res.status(400).send(new ErrorResponse(400, 'Bad Request', msg));
            return;
        }

        //Since project may be assigned to a Team, the now null reference should be removed from the team projects references.
        const teams = await Team.find();
        teams.map(async (team) => {
            if (team.projects.includes({ projectRef: projectID })) {
                team.projects = team.projects.filter((project) => project.projectRef != projectID);
                await team.save();
            }
        });

        res.status(200).send(new SuccessResponse(200, 'Ok', 'Deleted Project successfully', {}));
    } catch (err) {
        next(err);
    }
};
