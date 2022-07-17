import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
        },

        projectID: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Project',
            required: [true, 'Bug reference to a project id required'],
        },

        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: [true, 'Creator reference is required'],
        },

        description: {
            type: String,
            trim: true,
            required: [true, 'Bug description is required'],
        },
        priority: {
            type: Number,
            min: 0,
            reuired: [true, 'Bug priority is required'],
        },
        status: {
            type: Number,
            min: 0,
            required: [true, 'Bug status is required'],
        },
    },
    { timestamps: true }
);

// //admin operation
// bugSchema.methods.assignFixer = async function (fixer) {
//     this.userID = fixer;
//     await this.save();
// };

bugSchema.methods.toJSON = function () {
    const bug = this;

    const bugObj = bug.toObject();
    delete bugObj.__v;

    return bugObj;
};

const Bug = mongoose.model('Bug', bugSchema);

export default Bug;
