import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        trim: true,
        required: [true, 'team name is required'],
    },
    teamLeaderID: {
        type: mongoose.SchemaTypes.ObjectID,
        ref: 'User',
        required: [true, 'team leader _id is required'],
    },
    projects: [
        {
            projectRef: {
                type: mongoose.SchemaTypes.ObjectID,
                ref: 'Project',
                required: [true, 'project _id is required'],
            },
        },
    ],

    members: [
        {
            memberRef: {
                type: mongoose.SchemaTypes.ObjectID,
                ref: 'User',
                required: [true, 'team member reference required'],
            },
        },
    ],
});

teamSchema.methods.toJSON = function () {
    const team = this.toObject();
    delete team.__v;

    return team;
};

const Team = mongoose.model('Team', teamSchema);
export default Team;
