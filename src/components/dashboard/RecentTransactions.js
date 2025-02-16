// components/dashboard/RecentTransactions.js
'use client';
import { motion } from 'framer-motion';

export default function RecentTransactions({ data }) {
    return (
      <div className="space-y-4">
        {data.map((t) => (
          <motion.div 
            key={t._id}
            whileHover={{ x: 5 }}
            className="flex items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
              ${t.category === 'Food' ? 'bg-orange-100' :
                t.category === 'Housing' ? 'bg-blue-100' :
                t.category === 'Transport' ? 'bg-purple-100' :
                t.category === 'Utilities' ? 'bg-green-100' : 'bg-pink-100'}`}
            >
              <span className="text-lg">
                {t.category === 'Food' ? '🍔' :
                 t.category === 'Housing' ? '🏠' :
                 t.category === 'Transport' ? '🚗' :
                 t.category === 'Utilities' ? '💡' : '🎲'}
              </span>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-800">{t.description}</span>
                <span className="font-semibold text-slate-900">
                  ${t.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{t.category}</span>
                <span className="text-slate-500">
                  {new Date(t.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }