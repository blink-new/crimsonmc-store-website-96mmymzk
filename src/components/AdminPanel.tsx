import React from 'react';
import { Trash2 } from 'lucide-react';

interface Order {
  id: string;
  userName: string;
  userAvatar: string;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  timestamp: string;
}

interface AdminPanelProps {
  orders: Order[];
  onDeleteOrder: (id: string) => void;
}

export default function AdminPanel({ orders, onDeleteOrder }: AdminPanelProps) {
  return (
    <div className="w-full bg-gradient-to-br from-red-900/80 to-gray-900/90 border border-red-700/40 rounded-2xl shadow-2xl p-8 text-left text-white space-y-6">
      <h2 className="text-3xl font-bold text-red-400 mb-6 text-center">Admin Panel - Orders</h2>
      {orders.length === 0 ? (
        <div className="text-gray-400 text-center text-lg">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-gray-800/70 rounded-xl p-4 border border-red-700/30 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <img src={order.userAvatar || '/mc-head.png'} alt={order.userName} className="w-12 h-12 rounded-full border-2 border-red-500 object-cover" />
                <div>
                  <div className="font-bold text-lg text-white">{order.userName}</div>
                  <div className="text-sm text-gray-400">{order.timestamp}</div>
                </div>
              </div>
              <div className="flex-1">
                <ul className="list-disc list-inside text-sm text-gray-300">
                  {order.items.map((item, idx) => (
                    <li key={idx}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)} each</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xl font-bold text-yellow-300">Total: ${order.totalPrice.toFixed(2)}</div>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                  onClick={() => onDeleteOrder(order.id)}
                >
                  <Trash2 className="w-5 h-5" /> Delete Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
