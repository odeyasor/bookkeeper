'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('userId', data.userId);
      router.push('/dashboard');
    } else {
      setMessage(data.error || 'שגיאה בהתחברות');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div dir="rtl" className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-right">
        <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">התחברות</h2>

        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          התחבר
        </button>

        <p className="text-sm mt-4 text-red-600">{message}</p>

        <p className="mt-6 text-sm text-gray-600 text-center">
          אין לך חשבון?{' '}
          <a href="/register" className="text-green-700 hover:underline font-semibold">
            הרשם כאן
          </a>
        </p>
      </div>
    </div>
  );
}
