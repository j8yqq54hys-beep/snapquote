import type { Quote } from "../types";
import { downloadQuote } from "../lib/pdf";

export function QuoteList({ quotes, onEdit, onDelete, onNew }: {
  quotes: Quote[];
  onEdit: (q: Quote) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-12 h-12 mx-auto rounded-lg bg-accent flex items-center justify-center text-xl font-semibold">Q</div>
        <h2 className="mt-2 text-lg font-semibold text-slate-300">No quotes yet</h2>
        <p className="mt-2 text-slate-400 max-w-sm mx-auto">
          Create your first professional quote in under a minute. Free, no signup, everything stays on your device.
        </p>
        <button onClick={onNew} className="mt-4 bg-accent text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700">
          Create your first quote
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-slate-300 mb-2">Your quotes ({quotes.length})</h2>
      {quotes.map(q => {
        const subtotal = q.lineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
        const discounted = subtotal - subtotal * (q.discount / 100);
        const final = discounted + discounted * (q.taxRate / 100);
        return (
          <div key={q.id} className="bg-white border border-slate-800 rounded-md p-2 flex flex-col sm:flex-row sm:items-center gap-1">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">{q.clientName || "Untitled client"}</p>
              <p className="text-sm text-slate-500 truncate">
                {new Date(q.createdAt).toLocaleDateString()} - {q.lineItems.length} item{q.lineItems.length !== 1 ? "s" : ""} - ${final.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => onEdit(q)} className="text-sm bg-slate-100 hover:bg-slate-200 rounded-md py-1 px-2 text-slate-900">
                Edit
              </button>
              <button onClick={() => downloadQuote(q)} className="text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md py-1 px-2 text-white">
                PDF
              </button>
              <button onClick={() => onDelete(q.id)} className="text-sm text-red-600 hover:bg-red-50 rounded-md py-1 px-2">
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
