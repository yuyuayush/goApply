import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    phone: String,
    dateOfBirth: Date,
    nationality: String,
    address: String,
    bio: String,
    education: [
        {
            school: String,
            fieldOfStudy: String,
            degree: String,
            startDate: Date,
            endDate: Date,
        }
    ],
}, { timestamps: true });

export default mongoose.models.UserProfile || mongoose.model("UserProfile", UserProfileSchema);
