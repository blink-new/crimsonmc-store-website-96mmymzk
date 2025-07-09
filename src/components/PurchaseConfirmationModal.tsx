import React from 'react';
import { X, MessageCircle, Ticket, Clock } from 'lucide-react';

interface PurchaseConfirmationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PurchaseConfirmationModal({ open, onClose }: PurchaseConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative border-2 border-red-700 text-center">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-yellow-300 mb-4">🎉 Purchase Confirmed! 🎉</h2>
        <p className="text-lg text-white mb-4">
          Thank you for your purchase!
        </p>
        <div className="space-y-3 mb-6">
          <p className="flex items-center justify-center gap-2 text-gray-200">
            <MessageCircle className="w-5 h-5 text-blue-400" /> Please head over to our Discord server.
          </p>
          <p className="flex items-center justify-center gap-2 text-gray-200">
            <Ticket className="w-5 h-5 text-green-400" /> Create a ticket to receive your role/items.
          </p>
          <p className="flex items-center justify-center gap-2 text-gray-200">
            <Clock className="w-5 h-5 text-orange-400" /> Reminder: We do not work 24/7, so please be patient! ⏳
          </p>
        </div>
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors"
          onClick={onClose}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}