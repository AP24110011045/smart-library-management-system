import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    fine: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['issued', 'returned', 'waiting'], default: 'issued' }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
