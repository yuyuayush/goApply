import mongoose, { Schema, Document } from "mongoose";

const ApplicationSchema = new Schema({
    userId: { type: String, required: true, index: true },
    universityId: { type: String, required: true },
    program: { type: String, required: true },
    status: { type: String, enum: ["draft", "submitted", "reviewed", "accepted", "rejected"], default: "draft" },
    submittedAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    notes: { type: String }
});

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
