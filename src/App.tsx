import { useState } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import CartDrawer from './components/CartDrawer';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPanel from './components/AdminPanel';
import PurchaseConfirmationModal from './components/PurchaseConfirmationModal';
import { Button } from './components/ui/button';

const RANKS = [
  { id: 1, name: 'VIP', price: 2 },
  { id: 2, name: 'Knight', price: 4 },
  { id: 3, name: 'Titan', price: 6 },
  { id: 4, name: 'Zeus', price: 8 },
  { id: 5, name: 'Devil', price: 10 },
];

export default function App() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [user, setUser] = useState<{ ign: string; avatarUrl: string } | null>(null);
  const [topCustomer, setTopCustomer] = useState<{ ign: string; amount: number; avatarUrl: string } | null>(null);
  const [quantitySelect, setQuantitySelect] = useState<{ id: number; open: boolean }>({ id: -1, open: false });
  const [pendingQty, setPendingQty] = useState(1);
  const [page, setPage] = useState<'home' | 'ranks' | 'coins' | 'crates' | 'admin'>('home');
  const [orders, setOrders] = useState([]);
  const [purchaseConfirmedOpen, setPurchaseConfirmedOpen] = useState(false);

  // Add to cart with quantity selection
  const handleAddToCart = (item: { id: number; name: string; price: number }) => {
    setQuantitySelect({ id: item.id, open: true });
    setPendingQty(1);
  };
  const confirmAddToCart = (item: { id: number; name: string; price: number }) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += pendingQty;
        return updated;
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: pendingQty }];
    });
    setQuantitySelect({ id: -1, open: false });
  };

  // Cart logic
  const handleRemove = (id: number) => setCart(cart.filter(i => i.id !== id));
  const handleQtyChange = (id: number, qty: number) => setCart(cart => cart.map(i => i.id === id ? { ...i, quantity: qty } : i));
  const handleCheckout = () => {
    if (user) {
      const newOrder = {
        id: Date.now().toString(),
        userName: user.ign,
        userAvatar: user.avatarUrl,
        items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
        totalPrice: cart.reduce((sum, i) => sum + i.price * i.quantity, 0) * (1 - discountPercent / 100),
        timestamp: new Date().toLocaleString(),
      };
      setOrders(prev => [...prev, newOrder]);

      const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      if (!topCustomer || total > topCustomer.amount) {
        setTopCustomer({ ign: user.ign, amount: total, avatarUrl: user.avatarUrl });
      }
    }
    setCart([]);
    setCartOpen(false);
    setPurchaseConfirmedOpen(true);
  };
  const discountPercent = user ? 5 : 0;

  // Admin logic
  const handleAdminLogin = (password: string) => {
    if (password === 'admin123') {
      setAdminLoggedIn(true);
      setAdminLoginOpen(false);
      setPage('admin');
    } else {
      alert('Incorrect password');
    }
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  // Navigation handler for sidebar and categories
  const goTo = (target: 'home' | 'ranks' | 'coins' | 'crates' | 'admin') => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Banner Header */}
      <header className="relative w-full">
        <img
          src="/crimsonmc-banner.png"
          alt="CrimsonMC Banner"
          className="w-full h-48 md:h-64 object-cover object-center shadow-lg border-b-4 border-red-700"
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-start justify-between px-6 py-4 pointer-events-none">
          {/* Back to Home Button */}
          <a
            href="/"
            className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white font-semibold rounded-full px-4 py-2 shadow-lg transition-colors pointer-events-auto"
            style={{ textDecoration: 'none' }}
            onClick={e => { e.preventDefault(); goTo('home'); }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </a>
          {/* Cart and Admin Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="relative border-red-500/30 text-red-400 hover:bg-red-500/10 pointer-events-auto"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="relative border-red-500/30 text-red-400 hover:bg-red-500/10 pointer-events-auto"
              onClick={() => setAdminLoginOpen(true)}
            >
              Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Main Centered Layout */}
      <section className="flex flex-col md:flex-row justify-center items-start gap-8 py-16 min-h-[500px]">
        <Sidebar
          onLoginClick={() => setLoginOpen(true)}
          topCustomer={topCustomer}
          loggedInUser={user}
          goTo={goTo}
          adminLoggedIn={adminLoggedIn}
        />
        {/* Info Card or Page Content */}
        <div className="w-full max-w-xl flex flex-col justify-center">
          {page === 'home' && (
            <>
              <div className="bg-gradient-to-br from-red-900/80 to-gray-900/90 border border-red-700/40 rounded-2xl shadow-2xl p-8 text-left text-white space-y-5 mb-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-yellow-300 mb-2">CrimsonMC Store</h2>
                <h3 className="text-lg font-semibold text-red-300 mb-2">Welcome</h3>
                <p className="text-sm text-gray-200 mb-2">
                  If you've completed a purchase but haven't received your items, please open a support ticket on our Discord server for assistance. For any billing concerns or payment-related questions, you can also create a ticket, and our team will respond within 48 hours.
                </p>
                <h4 className="text-base font-bold text-red-400 mt-4 mb-1">Refund Policy</h4>
                <p className="text-sm text-gray-200 mb-2">
                  All purchases are final and non-refundable. Initiating a chargeback or disputing a payment through PayPal will lead to a permanent and irreversible ban from all our servers and associated Minecraft stores.
                </p>
                <p className="text-sm text-gray-200 mb-2">
                  Please allow up to 20 minutes for your purchase to be processed in-game. If you do not receive your items within this timeframe, submit a support ticket on our Discord server with proof of purchase, and we will look into the issue.
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  CrimsonMC is not affiliated with or endorsed by Minecraft, Mojang or Microsoft.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800/50 border-gray-700/50 hover:border-red-500/50 transition-all duration-300 group rounded-xl p-6 text-center cursor-pointer" onClick={() => goTo('ranks')}>
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400">Ranks</h3>
                  <p className="text-gray-400">Unlock exclusive perks and commands.</p>
                </div>
                <div className="bg-gray-800/50 border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300 group rounded-xl p-6 text-center cursor-pointer" onClick={() => goTo('coins')}>
                  <h3 className="text-xl font-bold text-yellow-300 group-hover:text-yellow-400">Coins</h3>
                  <p className="text-gray-400">Buy coins for in-game perks.</p>
                </div>
                <div className="bg-gray-800/50 border-gray-700/50 hover:border-red-500/50 transition-all duration-300 group rounded-xl p-6 text-center cursor-pointer" onClick={() => goTo('crates')}>
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400">Crates</h3>
                  <p className="text-gray-400">Get rare items and unique rewards.</p>
                </div>
              </div>
            </>
          )}
          {page === 'coins' && (
            <div className="bg-gradient-to-br from-yellow-900/80 to-gray-800/90 border border-yellow-500/40 rounded-2xl shadow-2xl p-8 text-center text-white space-y-8">
              <h2 className="text-3xl font-bold text-yellow-300 mb-8">Coins</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { id: 1, name: '1,000 Coins', price: 4 },
                  { id: 2, name: '5,000 Coins', price: 6 },
                  { id: 3, name: '100,000 Coins', price: 8 },
                ].map(coin => (
                  <div key={coin.id} className="bg-gray-800/70 rounded-xl p-6 flex flex-col gap-3 border border-yellow-500/30 items-center">
                    <div className="font-bold text-2xl text-yellow-200 mb-2">{coin.name}</div>
                    <div className="text-yellow-300 font-bold text-xl mb-4">${coin.price.toFixed(2)}</div>
                    <Button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black mt-2 font-bold"
                      onClick={() => handleAddToCart({ id: 1000 + coin.id, name: coin.name, price: coin.price })}
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page === 'ranks' && (
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/90 border border-red-700/40 rounded-2xl shadow-2xl p-8 text-center text-white space-y-8">
              <h2 className="text-3xl font-bold text-red-400 mb-8">Ranks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {RANKS.map(rank => (
                  <div key={rank.id} className="bg-gray-800/70 rounded-xl p-6 flex flex-col gap-3 border border-red-700/30 items-center">
                    <div className="font-bold text-2xl text-yellow-200 mb-2">{rank.name}</div>
                    <div className="text-red-300 font-bold text-xl mb-4">${rank.price.toFixed(2)}</div>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white mt-2"
                      onClick={() => handleAddToCart(rank)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page === 'crates' && (
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/90 border border-red-700/40 rounded-2xl shadow-2xl p-8 text-center text-white space-y-8">
              <h2 className="text-3xl font-bold text-red-400 mb-8">Crates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { id: 1, name: 'Small Crate', price: 10 },
                  { id: 2, name: 'Medium Crate', price: 20 },
                  { id: 3, name: 'Large Crate', price: 30 },
                ].map(crate => (
                  <div key={crate.id} className="bg-gray-800/70 rounded-xl p-6 flex flex-col gap-3 border border-red-700/30 items-center">
                    <div className="font-bold text-2xl text-yellow-200 mb-2">{crate.name}</div>
                    <div className="text-red-300 font-bold text-xl mb-4">${crate.price.toFixed(2)}</div>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white mt-2"
                      onClick={() => handleAddToCart(crate)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page === 'admin' && adminLoggedIn && (
            <AdminPanel orders={orders} onDeleteOrder={handleDeleteOrder} />
          )}
          {page === 'admin' && !adminLoggedIn && (
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/90 border border-red-700/40 rounded-2xl shadow-2xl p-8 text-center text-white space-y-5">
              <h2 className="text-3xl font-bold text-red-400 mb-4">Admin Access Denied</h2>
              <p className="text-lg text-gray-300">Please log in as an administrator to view this page.</p>
            </div>
          )}
        </div>
      </section>

      {/* Login/Register Modal */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={setUser} />
      {/* Admin Login Modal */}
      <AdminLoginModal open={adminLoginOpen} onClose={() => setAdminLoginOpen(false)} onLogin={handleAdminLogin} />
      {/* Cart Drawer/Overlay */}
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onRemove={handleRemove}
        onQuantityChange={handleQtyChange}
        onCheckout={handleCheckout}
        discountPercent={discountPercent}
      />

      {/* Quantity selector modal */}
      {quantitySelect.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 border-2 border-red-700 rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center">
            <div className="text-lg font-bold text-yellow-300 mb-2">Select Quantity</div>
            <input
              type="number"
              min={1}
              value={pendingQty}
              onChange={e => setPendingQty(Math.max(1, Number(e.target.value)))}
              className="w-20 text-center bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white mb-4"
            />
            <div className="flex gap-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => confirmAddToCart(RANKS.find(r => r.id === quantitySelect.id)!)}>
                Add
              </Button>
              <Button variant="outline" className="text-gray-400 border-gray-600" onClick={() => setQuantitySelect({ id: -1, open: false })}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      <PurchaseConfirmationModal open={purchaseConfirmedOpen} onClose={() => setPurchaseConfirmedOpen(false)} />

      {/* Footer */}
      <footer className="bg-black/90 border-t border-red-500/20 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <span className="text-xl font-bold text-red-400 mb-2 md:mb-0">CrimsonMC</span>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">2024 CrimsonMC. All rights reserved.</p>
              <p className="text-sm text-gray-500">
                Join our community • Discord: discord.gg/crimsonmc
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}