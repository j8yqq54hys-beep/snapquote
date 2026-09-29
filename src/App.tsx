import { useEffect, useState } from 'react';
import type { BusinessInfo, Quote } from './types';
import { loadBusiness, loadQuotes, saveBusiness, saveQuotes } from './lib/storage';
import { QuoteList } from './components/QuoteList';
import { QuoteEditor } from './components/QuoteEditor';
import { BusinessSettings } from './components/BusinessSettings';

type View = 'list' | 'edit' | 'settings';

const emptyQuote = (business: BusinessInfo): Quote => ({
  id: crypto.randomUUID(),
  createdAt: Date.now(),
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  jobDescription: '',
  lineItems: [{ id: crypto.randomUUID(), description: '', qty: 1, unitPrice: 0 }],
  taxRate: 0,
  discount: 0,
  notes: '',
  validDays: 30,
  business,
});

export default function App() {
  const [view, setView] = useState<View>('list');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [business, setBusiness] = useState<BusinessInfo>({ name: '', email: '', phone: '', address: '', license: '' });
  const [editing, setEditing] = useState<Quote | null>(null);

  useEffect(() => {
    setQuotes(loadQuotes());
    setBusiness(loadBusiness());
  }, []);

  useEffect(() => { saveQuotes(quotes); }, [quotes]);
  useEffect(() => { saveBusiness(business); }, [business]);

  const newQuote = () => {
    setEditing(emptyQuote(business));
    setView('edit');
  };

  const saveQuote = (q: Quote) => {
    setQuotes(prev => {
      const idx = prev.findIndex(x => x.id === q.id);
      if (idx >= 0) { const copy = [...prev]; copy[idx] = q; return copy; }
      return [q, ...prev];
    });
    setView('list');
    setEditing(null);
  };

  const deleteQuote = (id: string) => {
    if (!confirm('Delete this quote?')) return;
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setView('list')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-semibold text-slate-900">SnapQuote</span>
          </button>
          <nav className="flex items-center gap-2">
            <button onClick={() => setView('settings')} className="text-sm text-slate-600 hover:text-slate-900 px-3 py-2">Settings</button>
            <button onClick={newQuote} className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium">New Quote</button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto px-4 py-8 flex-1">
        {view === 'list' && (
          <QuoteList quotes={quotes} onEdit={(q) => { setEditing(q); setView('edit'); }} onDelete={deleteQuote} onNew={newQuote} />
        )}
        {view === 'edit' && editing && (
          <QuoteEditor quote={editing} onSave={saveQuote} onCancel={() => { setView('list'); setEditing(null); }} />
        )}
        {view === 'settings' && (
          <BusinessSettings business={business} onChange={setBusiness} onDone={() => setView('list')} />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-5 text-sm text-slate-500 flex flex-col sm:flex-row gap-2 sm:justify-between">
          <p>SnapQuote - free forever. Your data stays on your device.</p>
          <div className="flex gap-4">
            <a href="./terms.html" className="hover:text-slate-900">Terms</a>
            <a href="./privacy.html" className="hover:text-slate-900">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
