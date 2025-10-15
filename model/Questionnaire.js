import mongoose, { Schema, Document } from "mongoose";



const QuestionnaireSchema = new Schema({
    userId: { type: String, required: true, index: true },
    step: { type: Number, required: true },
    answers: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Questionnaire || mongoose.model("Questionnaire", QuestionnaireSchema);
