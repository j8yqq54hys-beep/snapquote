import { useState } from 'react';
import type { LineItem, Quote } from '../types';
import { downloadQuote } from '../lib/pdf';

const inputCls = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";

export function QuoteEditor({ quote, onSave, onCancel }: {
  quote: Quote;
  onSave: (q: Quote) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState<Quote>(quote);
  const [preview, setPreview] = useState(false);

  const update = <K extends keyof Quote>(k: K, v: Quote[K]) => setQ(prev => ({ ...prev, [k]: v }));

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setQ(prev => ({ ...prev, lineItems: prev.lineItems.map(i => i.id === id ? { ...i, ...patch } : i) }));
  };

  const addItem = () => setQ(prev => ({
    ...prev,
    lineItems: [...prev.lineItems, { id: crypto.randomUUID(), description: '', qty: 1, unitPrice: 0 }],
  }));

  const removeItem = (id: string) => setQ(prev => ({
    ...prev,
    lineItems: prev.lineItems.filter(i => i.id !== id),
  }));

  const subtotal = q.lineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const discountAmt = subtotal * (q.discount / 100);
  const taxable = subtotal - discountAmt;
  const tax = taxable * (q.taxRate / 100);
  const total = taxable + tax;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={onCancel} className="text-sm text-slate-600 hover:text-slate-900">Back</button>
        <div className="flex gap-2">
          <button onClick={() => setPreview(p => !p)} className="text-sm px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={() => downloadQuote(q)} className="text-sm px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">Download PDF</button>
          <button onClick={() => onSave(q)} className="text-sm px-4 py-2 rounded-lg bg-primary hover:bg-primary text-white font-medium">Save</button>
        </div>
      </div>

      {preview ? (
        <PreviewCard quote={q} subtotal={subtotal} discountAmt={discountAmt} tax={tax} total={total} />
      ) : (
        <>
          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Client</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={q.clientName} onChange={e => update('clientName', e.target.value)} placeholder="Jane Smith" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input className={inputCls} value={q.clientEmail} onChange={e => update('clientEmail', e.target.value)} placeholder="jane@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <input className={inputCls} value={q.clientAddress} onChange={e => update('clientAddress', e.target.value)} placeholder="123 Main St, Toronto, ON" />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Job details</h3>
            <label className={labelCls}>Scope of work</label>
            <textarea className={inputCls + ' resize-y min-h-[80px]'} value={q.jobDescription} onChange={e => update('jobDescription', e.target.value)} placeholder="Describe the job in a sentence or two..." />
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Line items</h3>
              <button onClick={addItem} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Add item</button>
            </div>
            <div className="space-y-3">
              {q.lineItems.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-12 sm:col-span-6">
                    <input className={inputCls} value={item.description} onChange={e => updateItem(item.id, { description: e.target.value })} placeholder="Description" />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input type="number" min={0} className={inputCls} value={item.qty} onChange={e => updateItem(item.id, { qty: parseFloat(e.target.value) || 0 })} placeholder="Qty" />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input type="number" min={0} step="0.01" className={inputCls} value={item.unitPrice} onChange={e => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })} placeholder="Unit" />
                  </div>
                  <div className="col-span-3 sm:col-span-1 text-right pt-2 text-sm text-slate-700">
                    ${(item.qty * item.unitPrice).toFixed(2)}
                  </div>
                  <div className="col-span-1 flex justify-end pt-1">
                    <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-600 text-lg leading-none">x</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Tax rate (%)</label>
                <input type="number" min={0} step="0.01" className={inputCls} value={q.taxRate} onChange={e => update('taxRate', parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelCls}>Discount (%)</label>
                <input type="number" min={0} max={100} step="0.01" className={inputCls} value={q.discount} onChange={e => update('discount', parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelCls}>Valid for (days)</label>
                <input type="number" min={1} className={inputCls} value={q.validDays} onChange={e => update('validDays', parseInt(e.target.value) || 30)} />
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-slate-100 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              {q.discount > 0 && <div className="flex justify-between"><span className="text-slate-600">Discount ({q.discount}%)</span><span className="font-medium text-red-600">-${discountAmt.toFixed(2)}</span></div>}
              {q.taxRate > 0 && <div className="flex justify-between"><span className="text-slate-600">Tax ({q.taxRate}%)</span><span className="font-medium">${tax.toFixed(2)}</span></div>}
              <div className="flex justify-between pt-2 border-t border-slate-100 text-base"><span className="font-semibold">Total</span><span className="font-bold text-slate-900">${total.toFixed(2)}</span></div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Notes and terms</h3>
            <textarea className={inputCls + ' resize-y min-h-[100px]'} value={q.notes} onChange={e => update('notes', e.target.value)} placeholder="Payment terms, warranty info, exclusions..." />
          </section>
        </>
      )}
    </div>
  );
}

function PreviewCard({ quote, subtotal, discountAmt, tax, total }: {
  quote: Quote; subtotal: number; discountAmt: number; tax: number; total: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">QUOTE</h1>
          <p className="text-sm text-slate-500 mt-1">#{quote.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <p className="text-sm text-slate-600">{new Date(quote.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-slate-900">{quote.business.name || 'Your Business'}</p>
        {quote.business.email && <p className="text-sm text-slate-600">{quote.business.email}</p>}
        {quote.business.phone && <p className="text-sm text-slate-600">{quote.business.phone}</p>}
        {quote.business.address && <p className="text-sm text-slate-600">{quote.business.address}</p>}
      </div>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Prepared for</p>
        <p className="font-medium text-slate-900">{quote.clientName || '-'}</p>
        {quote.clientEmail && <p className="text-sm text-slate-600">{quote.clientEmail}</p>}
        {quote.clientAddress && <p className="text-sm text-slate-600">{quote.clientAddress}</p>}
      </div>

      {quote.jobDescription && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Scope of work</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{quote.jobDescription}</p>
        </div>
      )}

      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="pb-2 font-medium text-slate-600">Description</th>
            <th className="pb-2 font-medium text-slate-600 text-right">Qty</th>
            <th className="pb-2 font-medium text-slate-600 text-right">Unit</th>
            <th className="pb-2 font-medium text-slate-600 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {quote.lineItems.map(i => (
            <tr key={i.id} className="border-b border-slate-100">
              <td className="py-2 text-slate-800">{i.description || '-'}</td>
              <td className="py-2 text-right text-slate-600">{i.qty}</td>
              <td className="py-2 text-right text-slate-600">${i.unitPrice.toFixed(2)}</td>
              <td className="py-2 text-right font-medium text-slate-900">${(i.qty * i.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-full sm:w-64 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {quote.discount > 0 && <div className="flex justify-between"><span className="text-slate-600">Discount</span><span>-${discountAmt.toFixed(2)}</span></div>}
          {quote.taxRate > 0 && <div className="flex justify-between"><span className="text-slate-600">Tax</span><span>${tax.toFixed(2)}</span></div>}
          <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>

      {quote.notes && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Notes</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{quote.notes}</p>
        </div>
      )}

      <p className="mt-8 text-xs text-slate-400">
        Valid for {quote.validDays} days. This is an estimate only and does not constitute a binding contract.
      </p>
    </div>
  );
}
