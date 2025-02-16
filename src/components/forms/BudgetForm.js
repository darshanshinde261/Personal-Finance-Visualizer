// components/forms/BudgetForm.js
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const formSchema = z.object({
  category: z.enum(['Food', 'Housing', 'Transport', 'Utilities', 'Other']),
  amount: z.number().min(1),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100)
});

export default function BudgetForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form onSubmit={handleSubmit(async (data) => {
      setIsSubmitting(true);
      try {
        await onSubmit(data);
      } finally {
        setIsSubmitting(false);
      }
    })} className="space-y-4">
      <div>
        <label>Category</label>
        <select {...register('category')} className="w-full p-2 border">
          {['Food', 'Housing', 'Transport', 'Utilities', 'Other'].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Amount ($)</label>
        <input
          type="number"
          {...register('amount', { valueAsNumber: true })}
          className="w-full p-2 border"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Month</label>
          <input
            type="number"
            {...register('month', { valueAsNumber: true })}
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label>Year</label>
          <input
            type="number"
            {...register('year', { valueAsNumber: true })}
            className="w-full p-2 border"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 w-full rounded"
      >
        {isSubmitting ? 'Saving...' : 'Set Budget'}
      </button>
    </form>
  );
}