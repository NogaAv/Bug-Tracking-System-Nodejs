import User from '../models/user.model.js';
import { SuccessResponse } from '../models/response.model.js';

export const createUser = async (req, res, next) => {
    const userData = req.body;

    try {
        const newUser = new User(userData);
        await newUser.save();

        const token = await newUser.generateAuthToken();
        res.status(201).send(
            new SuccessResponse(201, 'Created', 'New user created successfully', {
                user: newUser,
                token: token,
            })
        );
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findUserByEmailAndPassword(req.body.email, req.body.password);
        if (!user) {
            throw new Error('Failed validating Email and Password');
        }
        const token = await user.generateAuthToken();
        res.status(200).send(
            new SuccessResponse(200, 'Ok', 'User logged in successfully', { user: user, token: token })
        );
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    let tokens = req.user.tokens;
    const token = req.token;
    try {
        tokens = tokens.filter((tokenObj) => {
            return tokenObj.token !== token;
        });
        req.user.tokens = tokens;

        await req.user.save();
        res.status(200).send(new SuccessResponse(200, 'Ok', 'Logged out succsessfully', {}));
    } catch (err) {
        next(err);
    }
};

export const getBugs = async (req, res, next) => {
    const user = req.user;
    try {
        await user.populate('bugs');

        res.status(200).send(new SuccessResponse(200, 'Ok', 'Retrieved user bugs successfully', { user: user }));
    } catch (err) {
        next(err);
    }
};
