import mongoose from 'mongoose';

const waitingListSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    ISBN: { type: String, required: true, unique: true, trim: true },
    totalCopies: { type: Number, required: true, min: 0 },
    availableCopies: { type: Number, required: true, min: 0 },
    issuedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    waitingList: [waitingListSchema]
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', author: 'text', description: 'text', category: 'text', ISBN: 'text' });

export default mongoose.model('Book', bookSchema);
