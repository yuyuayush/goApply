import mongoose, { Schema, Document } from "mongoose";

export interface IDeadline extends Document {
    userId: string;
    applicationId?: string;
    date: Date;
    type: string; // e.g., "submission", "reminder"
    description: string;
}

const DeadlineSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    applicationId: { type: String },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
});

export default mongoose.models.Deadline || mongoose.model<IDeadline>("Deadline", DeadlineSchema);
