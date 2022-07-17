import { SuccessResponse, ErrorResponse } from '../models/response.model.js';
import Bug from '../models/bug.model.js';
import Project from '../models/project.model.js';

export const getAll = async (req, res, next) => {
    try {
        const bugs = await Bug.find();
        res.status(200).send(new SuccessResponse(200, 'Ok', 'Retrieved all bugs in DB successfully', { bugs: bugs }));
    } catch (err) {
        next(err);
    }
};

export const getBugsByProject = async (req, res, next) => {
    const projectID = req.params.id;
    if (!projectID) {
        res.status(400).send(new ErrorResponse(400, 'Bad Request', 'Invalid request string params'));
        return;
    }

    try {
        const project = await Project.findById(projectID);
        if (!project) {
            res.status(400).send(new ErrorResponse(400, 'Invalid request', 'Project is not found in DB'));
            return;
        }
        const bugs = project.populate('bugs');

        res.status(200).send(
            new SuccessResponse(200, 'Ok', 'Retrieved project bugs list successfully', { bugs: bugs })
        );
    } catch (err) {
        next(err);
    }
};

export const getBug = async (req, res, next) => {
    const bugID = req.params.id;
    if (!bugID) {
        res.status(400).send(new ErrorResponse(400, 'Invalid request', 'Bug id is missing in the request'));
        return;
    }
    try {
        const bug = await Bug.findById(bugID);
        if (!bug) {
            res.status(400).send(new ErrorResponse(400, 'Invalid request', 'Bug id is not found in DB'));
            return;
        }
        res.status(200).send(new SuccessResponse(200, 'Ok', 'Retrieved bug successfully', { bug: bug }));
    } catch (err) {
        next(err);
    }
};

export const createBug = async (req, res, next) => {
    const user = req.user;
    req.body.createdBy = user;

    try {
        const newBug = new Bug(req.body);
        await newBug.save();

        res.status(201).send(new SuccessResponse(201, 'Created', 'New Bug created', { bug: newBug }));
    } catch (err) {
        next(err);
    }
};

export const updateBug = async (req, res, next) => {
    const bugID = req.params.id;
    const updatedData = req.body;

    //Bug assignment can only be done by Admin
    if (updatedData.userID) delete updatedData.userID;
    //Creation data cannot be updated by user
    if (updatedData.createdBy) delete updatedData.createdBy;
    try {
        await Bug.findByIdAndUpdate(bugID, updatedData);
        res.status(200).send(new SuccessResponse(200, 'Ok', 'Updated bug successfully', {}));
    } catch (err) {
        next(err);
    }
};

export const assignBug = async (req, res, next) => {
    const bugID = req.params.id;
    const userId = req.body.userID;
    if (!bugID || !userId) {
        res.status(400).send(
            new ErrorResponse(400, 'Invalid request', 'Bug id and User id are required to be sent in request')
        );
        return;
    }
    try {
        await Bug.findByIdAndUpdate(bugID, { userID: userId });
        res.status(200).send(new SuccessResponse(200, 'Ok', 'Assigned bug successfully', {}));
    } catch (err) {
        next(err);
    }
};

export const deleteBug = async (req, res, next) => {
    const bugID = req.params.id;

    try {
        if (!bugID) {
            res.status(400).send(new ErrorResponse(400, 'Bad Request', 'Bug _id is missing from request.'));
            return;
        }

        const delResult = await Bug.deleteOne({ _id: bugID });
        if (delResult.deletedCount !== 1) {
            const msg =
                delResult.deletedCount === 0
                    ? 'Bug id does not exist in DB'
                    : `Deletion count operation returned: ${delResult.deletedCount}`;

            res.status(400).send(new ErrorResponse(400, 'Bad Request', msg));
            return;
        }

        res.status(200).send(new SuccessResponse(200, 'Ok', 'Deleted Bug successfully', {}));
    } catch (err) {
        next(err);
    }
};
