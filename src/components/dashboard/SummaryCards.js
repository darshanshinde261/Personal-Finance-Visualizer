// components/dashboard/SummaryCards.js
'use client';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, CreditCard, PieChart } from 'react-feather';

const cardVariants = {
  hover: { 
    y: -5,
    transition: { type: 'spring', stiffness: 300 }
  },
  tap: { scale: 0.98 }
};

export default function SummaryCards({ 
  totalExpenses, 
  recentTransactions,
  categoryData 
}) {
  // Calculate categories with valid data
  const categories = Object.entries(categoryData || {})
    .map(([name, value]) => ({
      name,
      value: Number(value),
      percentage: totalExpenses > 0 
        ? (Number(value) / totalExpenses) * 100 
        : 0
    }))
    .filter(c => c.value > 0);
  // Detect if all categories have equal spending
  const allEqual = categoryData.length > 1 && 
  categoryData.every(c => c.value === categoryData[0].value);

  // Find top category only if not all equal
  const topCategory = !allEqual && categoryData.length > 0
    ? categoryData.reduce((max, current) => 
        current.value > max.value ? current : max,
    categoryData[0]
      )
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Expenses Card */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
        className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <CreditCard className="w-8 h-8 opacity-75" />
          <span className="text-sm font-semibold">Total Expenses</span>
        </div>
        <h3 className="text-3xl font-bold mb-4">
          ${totalExpenses.toFixed(2)}
        </h3>
        <div className="h-1 bg-white/20 rounded-full">
          <div 
            className="h-full bg-white rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, (totalExpenses / 5000) * 100)}%` }}
          />
        </div>
      </motion.div>

      {/* Transactions Count Card */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
        className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 rounded-2xl text-white shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <ArrowUp className="w-8 h-8 opacity-75" />
          <span className="text-sm font-semibold">This Month</span>
        </div>
        <h3 className="text-3xl font-bold mb-2">
          {recentTransactions.length}
        </h3>
        <p className="opacity-90 text-sm">Transactions</p>
        <div className="mt-4 flex items-center text-sm">
          <ArrowDown className="w-4 h-4 mr-1" />
          <span>+24% from last month</span>
        </div>
      </motion.div>

      {/* Top Category Card */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
        className="bg-gradient-to-br from-purple-600 to-pink-700 p-6 rounded-2xl text-white shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <PieChart className="w-8 h-8 opacity-75" />
          <span className="text-sm font-semibold">Top Category</span>
        </div>
        
        {allEqual ? (
          <div className="text-center py-4">
            <p className="text-sm opacity-90">Equal spending across categories</p>
          </div>
        ) : topCategory ? (
          <>
            <h3 className="text-3xl font-bold mb-2">{topCategory.name}</h3>
            <div className="w-full bg-white/20 h-2 rounded-full mt-4">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${Math.floor((topCategory.value/totalExpenses)*100)}%` }}
              />
            </div>
            <p className="mt-2 text-sm opacity-90">
              {Math.floor((topCategory.value/totalExpenses)*100)}% of total
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm opacity-90">
              {totalExpenses > 0 ? 'No category spending' : 'No transactions yet'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}