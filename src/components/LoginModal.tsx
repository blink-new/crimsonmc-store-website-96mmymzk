import React, { useRef, useState } from 'react';

interface User {
  ign: string;
  avatarUrl: string;
  password: string;
}

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (user: User, isNewUser: boolean) => void;
}

export default function LoginModal({ open, onClose, onLogin }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [ign, setIgn] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!ign || !password) {
      setError('Please enter both IGN and password.');
      return;
    }

    const usersJson = localStorage.getItem('users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    const existingUser = users.find(u => u.ign.toLowerCase() === ign.toLowerCase());

    if (isLogin) {
      if (existingUser && existingUser.password === password) {
        onLogin(existingUser, false);
        onClose();
      } else {
        setError('Invalid IGN or password.');
      }
    } else {
      if (existingUser) {
        setError('This IGN is already taken.');
      } else {
        const newUser: User = {
          ign,
          avatarUrl: avatarUrl || '/mc-head.png',
          password
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        onLogin(newUser, true);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm relative border-2 border-red-700">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-red-400 mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <img
                  src={avatarUrl || '/mc-head.png'}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full border-4 border-red-500 object-cover"
                />
              </label>
              <input
                id="avatar-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                className="text-xs text-red-300 underline hover:text-red-400"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Profile Pic
              </button>
            </div>
          )}
          <input
            type="text"
            placeholder="Enter your IGN (Minecraft username)"
            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-400"
            value={ign}
            onChange={e => setIgn(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg mt-2 transition-colors"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-4">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-400 hover:underline">
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
