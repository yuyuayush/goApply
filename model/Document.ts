import mongoose, { Schema, Document } from "mongoose";

export interface IDocument extends Document {
    userId: string;
    applicationId?: string;
    type: string; // e.g., "transcript", "resume", "recommendation"
    url: string;
    uploadedAt: Date;
}

const DocumentSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    applicationId: { type: String },
    type: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);
