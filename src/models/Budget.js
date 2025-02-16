// models/Budget.js
import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Food', 'Housing', 'Transport', 'Utilities', 'Other'],
    required: true
  },
  amount: { type: Number, required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true }
});

export default mongoose.models.Budget || 
       mongoose.model('Budget', BudgetSchema);