import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
    userId: string;
    applicationId: string;
    amount: number;
    method: string;    // e.g., "credit_card", "paypal"
    status: string;    // e.g., "pending", "completed", "failed"
    paidAt?: Date;
}

const PaymentSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    applicationId: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: { type: String, default: "pending" },
    paidAt: { type: Date },
});

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
