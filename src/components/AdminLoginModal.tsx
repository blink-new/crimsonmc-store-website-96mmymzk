import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
}

export default function AdminLoginModal({ open, onClose, onLogin }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
    setPassword(''); // Clear password field after attempt
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm relative border-2 border-red-700">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-red-400 mb-4 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg mt-2 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
