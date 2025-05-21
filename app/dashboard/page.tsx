'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Entry = {
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
};


export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const router = useRouter();

  // טוען נתונים מ־API לפי userId
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/entries?userId=${userId}`)
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(console.error);
  }, [userId]);

  const handleAddEntry = async () => {
    if (!description || !amount || !date || !userId) return;

    const newEntry: Entry = {
      type: formType,
      description,
      amount: parseFloat(amount),
      date,
    };

    // שולח לשרת
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newEntry, userId }),
    });

    if (res.ok) {
      const savedEntry = await res.json();
      setEntries([...entries, savedEntry]);
      setShowForm(false);
      setDescription('');
      setAmount('');
      setDate('');
    } else {
      // טיפול בשגיאה (אפשר להוסיף הודעה למשתמש)
      console.error('Error saving entry');
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        מנהל הכנסות והוצאות
      </h1>
      <div className="bg-white p-4 rounded shadow-md mb-6 w-full max-w-md text-center">
        <p className="text-green-600 font-semibold">
          סך הכנסות: {entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0)} ₪
        </p>
        <p className="text-red-600 font-semibold">
          סך הוצאות: {entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)} ₪
        </p>
        <p className="text-blue-700 font-bold mt-2">
          יתרה: {
            entries.reduce((sum, e) =>
              e.type === 'income' ? sum + e.amount : sum - e.amount, 0)
          } ₪
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => {
            setFormType('income');
            setShowForm(true);
          }}
        >
          הוספת הכנסה
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => {
            setFormType('expense');
            setShowForm(true);
          }}
        >
          הוספת הוצאה
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded shadow-md mb-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            {formType === 'income' ? 'הוספת הכנסה' : 'הוספת הוצאה'}
          </h2>
          <input
            type="text"
            placeholder="תיאור"
            className="w-full mb-2 p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="סכום"
            className="w-full mb-2 p-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="date"
            className="w-full mb-2 p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            onClick={handleAddEntry}
          >
            שמור
          </button>
        </div>
      )}

      <div className="w-full max-w-md">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-2 mb-2 rounded ${
              entry.type === 'income'
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}
          >
            <span>{entry.description}</span>
            <span>{entry.amount} ₪</span>
            <span className="text-sm text-gray-500">{entry.date}</span>
          </div>
        ))}
        <button
  onClick={() => router.push('/monthly-summary')}
  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  סיכום חודשי
</button>
      </div>
    </main>
  );
}
