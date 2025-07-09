import React from 'react';
import { X } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, qty: number) => void;
  onCheckout: () => void;
  discountPercent?: number;
}

export default function CartDrawer({ open, items, onClose, onRemove, onQuantityChange, onCheckout, discountPercent = 0 }: CartDrawerProps) {
  if (!open) return null;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * (discountPercent / 100);
  const total = subtotal - discount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40">
      <div className="bg-gray-900 w-full max-w-md h-full shadow-2xl p-8 relative border-l-2 border-red-700 flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-400"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-red-400 mb-6">Your Cart</h2>
        {items.length === 0 ? (
          <div className="text-gray-400 text-center mt-16">Your cart is empty.</div>
        ) : (
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                <div className="flex-1">
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-sm text-gray-400">${item.price.toFixed(2)} each</div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => onQuantityChange(item.id, Math.max(1, Number(e.target.value)))}
                  className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-center"
                />
                <button
                  className="text-red-400 hover:text-red-300 ml-2"
                  onClick={() => onRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 border-t border-gray-700 pt-4">
          <div className="flex justify-between text-white font-semibold mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between text-green-400 font-semibold mb-2">
              <span>Discount ({discountPercent}% off)</span>
              <span>- ${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl text-red-400 font-bold mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-2 transition-colors disabled:opacity-60"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
