'use client';

import { useEffect, useState } from 'react';

type MonthlySummary = {
  yearMonth: string;
  totalIncome: number;
  totalExpense: number;
};

export default function MonthlySummaryPage() {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // לדוגמה, להביא מה-localStorage

fetch(`/api/summary?userId=${userId}`)
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data)) throw new Error("Invalid response");
    setSummaries(data);
    setLoading(false);
  })
  .catch(err => {
    console.error("שגיאה בקבלת הסיכומים:", err);
    setLoading(false);
  });



  if (loading) return <div>טוען...</div>;
  if (!userId) return <div>יש להתחבר כדי לראות את הסיכומים</div>;

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">סיכום חודשי</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">חודש</th>
            <th className="border border-gray-300 p-2">הכנסות</th>
            <th className="border border-gray-300 p-2">הוצאות</th>
            <th className="border border-gray-300 p-2">יתרה</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map(({ yearMonth, totalIncome, totalExpense }) => (
            <tr key={yearMonth}>
              <td className="border border-gray-300 p-2">{yearMonth}</td>
              <td className="border border-gray-300 p-2 text-green-700">{totalIncome.toFixed(2)} ₪</td>
              <td className="border border-gray-300 p-2 text-red-700">{totalExpense.toFixed(2)} ₪</td>
              <td className="border border-gray-300 p-2 text-blue-700">
                {(totalIncome - totalExpense).toFixed(2)} ₪
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
