import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
    },
    reminderDays: { type: Number, default: 1 }, // number of days before a reminder
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
