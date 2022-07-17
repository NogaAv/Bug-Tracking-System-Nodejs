import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'Project title is required'],
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Project description is required'],
        },
        teamID: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Team',
            required: [true, 'Team reference is required'],
        },
    },

    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

projectSchema.virtual('bugs', {
    ref: 'Bug',
    localField: '_id',
    foreignField: 'projectID',
});

projectSchema.methods.toJSON = function () {
    const project = this.toObject();
    delete project.__v;

    return project;
};

const Project = mongoose.model('Project', projectSchema);
export default Project;
