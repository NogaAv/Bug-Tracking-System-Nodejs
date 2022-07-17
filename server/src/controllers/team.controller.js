import { SuccessResponse, ErrorResponse } from '../models/response.model.js';
import Project from '../models/project.model.js';
import Team from '../models/team.model.js';

export const getAll = async (req, res, next) => {
    try {
        const teams = await Team.find();
        res.status(200).send(
            new SuccessResponse(200, 'Ok', 'Retrieved all teams from DB successfully', { teams: teams })
        );
    } catch (err) {
        next(err);
    }
};

export const getTeam = async (req, res, next) => {
    const teamID = req.params.id;
    if (!teamID) {
        res.status(400).send(new ErrorResponse(400, 'Invalid request', 'Team id is missing in the request'));
        return;
    }
    try {
        const teamFound = await Team.findById(teamID);
        if (!teamFound) {
            res.status(400).send(new ErrorResponse(400, 'Invalid request', 'Team id is not found in DB'));
            return;
        }
        res.status(200).send(new SuccessResponse(200, 'Ok', 'Retrieved team successfully', { team: teamFound }));
    } catch (err) {
        next(err);
    }
};

export const updateTeam = async (req, res, next) => {
    const teamID = req.params.id;
    const updatedData = req.body;

    try {
        await Team.findByIdAndUpdate(teamID, updatedData);
        res.status(200).send(new SuccessResponse(200, 'Ok', 'Updated team successfully', {}));
    } catch (err) {
        next(err);
    }
};

export const createTeam = async (req, res, next) => {
    try {
        const newTeam = new Team(req.body);
        await newTeam.save();

        res.status(201).send(new SuccessResponse(201, 'Created', 'New Team created', { team: newTeam }));
    } catch (err) {
        next(err);
    }
};

export const deleteTeam = async (req, res, next) => {
    const teamID = req.params.id;
    if (!teamID) {
        res.status(400).send(new ErrorResponse(400, 'Bad Request', 'Team _id is missing from request.'));
        return;
    }

    try {
        const projects = await Project.find();
        projects.map((project) => {
            if (project.teamID === teamID) {
                res.status(400).send(
                    new ErrorResponse(
                        400,
                        'Bad Request',
                        `Failed to delete: Team is referenced by Project with id: ${project._id}. Redirect ref to other Team before deletion`
                    )
                );
                return;
            }
        });

        const delResult = await Team.deleteOne({ _id: teamID });
        if (delResult.deletedCount !== 1) {
            const msg =
                delResult.deletedCount === 0
                    ? 'Team id does not exist in DB'
                    : `Deletion count operation returned: ${delResult.deletedCount}`;

            res.status(400).send(new ErrorResponse(400, 'Bad Request', msg));
            return;
        }

        res.status(200).send(new SuccessResponse(200, 'Ok', 'Deleted Team successfully', {}));
    } catch (err) {
        next(err);
    }
};
