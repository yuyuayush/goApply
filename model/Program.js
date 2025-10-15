import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
    name: { type: String, required: true },
    degreeType: { type: String, enum: ["Bachelors", "Masters", "PhD", "Diploma", "Certificate"] },
    duration: { type: String }, // e.g., "4 years", "2 years"
    requirements: { type: String },
}, { timestamps: true });

export default mongoose.models.Program || mongoose.model("Program", programSchema);
