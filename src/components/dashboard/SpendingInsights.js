// components/dashboard/SpendingInsights.js
'use client';

export default function SpendingInsights({ data }) {
  const overspentCategories = data.filter(item => item.actual > item.budget);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Spending Alerts</h3>
      {overspentCategories.length > 0 ? (
        overspentCategories.map(item => (
          <div key={item.category} className="text-red-500">
            {item.category}: Exceeded budget by ${(item.actual - item.budget).toFixed(2)}
          </div>
        ))
      ) : (
        <div className="text-green-500">All categories within budget!</div>
      )}
    </div>
  );
}