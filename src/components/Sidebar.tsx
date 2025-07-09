import React from 'react';
import { Home, Layers, Gift, Trophy, DollarSign } from 'lucide-react';

interface SidebarProps {
  onLoginClick: () => void;
  topCustomer?: { ign: string; amount: number; avatarUrl: string };
  loggedInUser?: { ign: string; avatarUrl: string };
  goTo: (page: 'home' | 'ranks' | 'coins' | 'crates' | 'admin') => void;
  adminLoggedIn: boolean;
}

export default function Sidebar({ onLoginClick, topCustomer, loggedInUser, goTo, adminLoggedIn }: SidebarProps) {
  return (
    <aside className="bg-gradient-to-br from-red-900/90 to-gray-900/90 border-r-2 border-red-700/40 rounded-2xl shadow-xl p-6 flex flex-col items-center w-64 min-h-[500px] relative z-10">
      {/* Head image */}
      <img
        src={loggedInUser?.avatarUrl || '/mc-head.png'}
        alt="Minecraft Head"
        className="w-20 h-20 rounded-full border-4 border-red-500 mb-4 object-cover"
        style={{ transform: 'rotateY(180deg)' }}
      />
      {/* Login/Register */}
      <button
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg mb-8 transition-colors"
        onClick={onLoginClick}
      >
        {loggedInUser ? `Hi, ${loggedInUser.ign}` : 'Login / Register'}
      </button>
      <nav className="flex flex-col gap-4 w-full">
        <button className="flex items-center gap-2 text-white hover:text-red-300 font-medium px-3 py-2 rounded transition-colors text-left" onClick={() => goTo('home')}>
          <Home className="w-5 h-5" /> Home
        </button>
        <button className="flex items-center gap-2 text-white hover:text-red-300 font-medium px-3 py-2 rounded transition-colors text-left" onClick={() => goTo('ranks')}>
          <Layers className="w-5 h-5" /> Ranks
        </button>
        <button className="flex items-center gap-2 text-yellow-300 font-medium px-3 py-2 rounded transition-colors text-left" onClick={() => goTo('coins')}>
          <DollarSign className="w-5 h-5" /> Coins
        </button>
        <button className="flex items-center gap-2 text-white hover:text-red-300 font-medium px-3 py-2 rounded transition-colors text-left" onClick={() => goTo('crates')}>
          <Gift className="w-5 h-5" /> Crates
        </button>
        {adminLoggedIn && (
          <button className="flex items-center gap-2 text-white hover:text-red-300 font-medium px-3 py-2 rounded transition-colors text-left" onClick={() => goTo('admin')}>
            <Trophy className="w-5 h-5" /> Admin Panel
          </button>
        )}
        <div className="mt-8">
          <div className="flex items-center gap-2 text-yellow-300 font-bold mb-2">
            <Trophy className="w-5 h-5" /> Top Customer
          </div>
          {topCustomer ? (
            <div className="flex items-center gap-2 bg-gray-800/70 rounded-lg p-2">
              <img src={topCustomer.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border-2 border-yellow-400" />
              <span className="text-white font-semibold">{topCustomer.ign}</span>
              <span className="text-yellow-300 font-bold ml-auto">${topCustomer.amount.toFixed(2)}</span>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No purchases yet</div>
          )}
        </div>
      </nav>
    </aside>
  );
}