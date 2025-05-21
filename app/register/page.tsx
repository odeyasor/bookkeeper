'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('נרשמת בהצלחה!');
    } else {
      setMessage(data.error || 'שגיאה בהרשמה');
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
      <div dir="rtl" className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-right">
        <h2 className="text-3xl font-bold mb-6 text-red-700 text-center">הרשמה</h2>

        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
        >
          הרשמה
        </button>

        <p className="text-sm mt-4 text-green-700">{message}</p>

        <p className="mt-6 text-sm text-gray-600 text-center">
          כבר יש לך חשבון?{' '}
          <a href="/login" className="text-red-700 hover:underline font-semibold">
            התחבר כאן
          </a>
        </p>
      </div>
    </div>
  );
}
