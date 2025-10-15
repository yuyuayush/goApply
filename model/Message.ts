import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    userId: string;       // Recipient
    senderId: string;     // Sender
    content: string;
    sentAt: Date;
    read: boolean;
}

const MessageSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
});

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
