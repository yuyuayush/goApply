import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
