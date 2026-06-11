import mongoose, { Schema, Document } from "mongoose";

const friendSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true , ref: 'User'},
        friendId: { type: Schema.Types.ObjectId, required: true , ref: 'User'},
    },
    { timestamps: true }
);
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });
export const Friends = mongoose.model("Friend", friendSchema);
