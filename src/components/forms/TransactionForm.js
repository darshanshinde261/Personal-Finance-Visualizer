// src/components/forms/TransactionForm.js
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const formSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be at least 0.01'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  category: z.enum(['Food', 'Housing', 'Transport', 'Utilities', 'Other']),
  date: z.date().default(new Date())
});

export default function TransactionForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(data);
      reset(); // Reset the form after successful submission
    } catch (error) {
      setError('Failed to submit transaction. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
          className="border p-2 w-full"
        />
        {errors.amount && (
          <p className="text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          {...register('description')}
          className="border p-2 w-full"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label>Category</label>
        <select
          {...register('category')}
          className="border p-2 w-full"
        >
          <option value="">Select Category</option>
          {['Food', 'Housing', 'Transport', 'Utilities', 'Other'].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500">{errors.category.message}</p>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Submitting...' : 'Add Transaction'}
      </button>
    </form>
  );
}