// models/Transaction.js
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Food', 'Housing', 'Transport', 'Utilities', 'Other'],
    required: true
  }
});

export default mongoose.models.Transaction || 
       mongoose.model('Transaction', TransactionSchema);