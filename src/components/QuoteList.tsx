import type { Quote } from '../types';
import { downloadQuote } from '../lib/pdf';

export function QuoteList({ quotes, onEdit, onDelete, onNew }: {
  quotes: Quote[];
  onEdit: (q: Quote) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl">Q</div>
        <h2 className="mt-4 text-xl font-semibold text-slate-900">No quotes yet</h2>
        <p className="mt-2 text-slate-600 max-w-sm mx-auto">Create your first professional quote in under a minute. Free, no signup, everything stays on your device.</p>
        <button onClick={onNew} className="mt-6 bg-primary text-white font-medium">
          Create your first quote
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Your quotes ({quotes.length})</h2>
      {quotes.map(q => {
        const subtotal = q.lineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
        const discounted = subtotal - subtotal * (q.discount / 100);
        const final = discounted + discounted * (q.taxRate / 100);
        return (
          <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">{q.clientName || 'Untitled client'}</p>
              <p className="text-sm text-slate-500 truncate">
                {new Date(q.createdAt).toLocaleDateString()} - {q.lineItems.length} item{q.lineItems.length !== 1 ? 's' : ''} - ${final.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(q)} className="text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">Edit</button>
              <button onClick={() => downloadQuote(q)} className="text-sm px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">PDF</button>
              <button onClick={() => onDelete(q.id)} className="text-sm px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
