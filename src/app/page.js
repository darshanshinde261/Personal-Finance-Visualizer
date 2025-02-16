// app/page.js
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, PieChart, ArrowUp, ArrowDown } from 'react-feather';
import TransactionForm from '@/components/forms/TransactionForm';
import BudgetForm from '@/components/forms/BudgetForm';
import MonthlyChart from '@/components/charts/MonthlyChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import BudgetChart from '@/components/charts/BudgetChart';
import SummaryCards from '@/components/dashboard/SummaryCards';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import SpendingInsights from '@/components/dashboard/SpendingInsights';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 120 }
  }
};

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data fetching functions
  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
      setTransactions(data);
      processMonthlyData(data);
    } catch (error) {
      setError('Failed to load transactions');
      console.error(error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await fetch('/api/budgets');
      if (!res.ok) throw new Error('Failed to fetch budgets');
      const data = await res.json();
      setBudgets(data);
    } catch (error) {
      setError('Failed to load budgets');
      console.error(error);
    }
  };

  // Data processing functions
  const processMonthlyData = (transactions) => {
    const monthly = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', {
        month: 'short'
      });
      acc[month] = (acc[month] || 0) + transaction.amount;
      return acc;
    }, {});

    setMonthlyData(
      Object.entries(monthly).map(([month, total]) => ({
        month,
        total
      }))
    );
  };

  const getBudgetComparison = () => {
    return budgets.map(budget => {
      const actual = transactions
        .filter(t => 
          t.category === budget.category &&
          new Date(t.date).getMonth() + 1 === budget.month &&
          new Date(t.date).getFullYear() === budget.year
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category: `${budget.category} (${budget.month}/${budget.year})`,
        budget: budget.amount,
        actual
      };
    });
  };

  // Form handlers
  const handleSubmit = async (transactionData) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (!res.ok) throw new Error('Failed to save transaction');
      await Promise.all([fetchTransactions(), fetchBudgets()]);
    } catch (error) {
      console.error('Transaction submission error:', error);
      throw error;
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTransactions(), fetchBudgets()]);
      } catch (error) {
        setError('Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Derived data
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const recentTransactions = transactions.slice(0, 5);
  const categoryData = Object.entries(
    transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <motion.main 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto p-4 space-y-8"
    >
      {/* Budget Management Section */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
        {/* Budget Form Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            <CreditCard className="inline-block mr-2" />
            Set New Budget
          </h2>
          <BudgetForm onSubmit={async (data) => {
            await fetch('/api/budgets', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(data)
            });
            await fetchBudgets();
          }} />
        </div>

        {/* Active Budgets Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            <PieChart className="inline-block mr-2" />
            Active Budgets
          </h2>
          {budgets.length > 0 ? (
            <motion.div className="space-y-3">
              {budgets.map((budget) => (
                <motion.div
                  key={budget._id}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <span className="font-medium text-slate-700">
                    {budget.category} 
                    <span className="text-slate-500 ml-2 text-sm">
                      ({budget.month}/{budget.year})
                    </span>
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ${budget.amount.toFixed(2)}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 italic">No active budgets yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Budget Visualization Section */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          <ArrowUp className="inline-block mr-2" />
          Budget Progress
        </h2>
        {budgets.length > 0 ? (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-96"
            >
              <BudgetChart data={getBudgetComparison()} />
            </motion.div>
            <SpendingInsights data={getBudgetComparison()} />
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 italic">Set budgets to see visualizations</p>
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
        <CategoryPieChart data={categoryData} />
      </motion.div>
      {/* Transaction Sections */}
      <SummaryCards 
        totalExpenses={totalExpenses}
        recentTransactions={recentTransactions}
        categoryData={categoryData}
      />

      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
        {/* Transaction Form */}
        <div className="bg-gradient-to-br from-green-50 to-cyan-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            <ArrowDown className="inline-block mr-2" />
            New Transaction
          </h2>
          <TransactionForm onSubmit={handleSubmit} />
        </div>

        {/* Monthly Chart */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            <PieChart className="inline-block mr-2" />
            Monthly Overview
          </h2>
          <div className="h-96">
            <MonthlyChart data={monthlyData} />
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Recent Activity
        </h2>
        <RecentTransactions data={recentTransactions} />
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="animate-pulse flex space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
              <div className="w-12 h-12 bg-purple-500 rounded-full"></div>
              <div className="w-12 h-12 bg-pink-500 rounded-full"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}