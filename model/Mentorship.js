import mongoose from "mongoose";

const mentorshipSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "declined", "completed"], default: "pending" },
    scheduledAt: { type: Date },
    notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Mentorship || mongoose.model("Mentorship", mentorshipSchema);
