import { useState } from 'react';
import type { BusinessInfo } from '../types';

const inputCls = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";

export function BusinessSettings({ business, onChange, onDone }: {
  business: BusinessInfo;
  onChange: (b: BusinessInfo) => void;
  onDone: () => void;
}) {
  const [b, setB] = useState(business);

  const save = () => { onChange(b); onDone(); };

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold text-slate-900 mb-2">Business settings</h2>
      <p className="text-sm text-slate-600 mb-6">These details appear on every quote. Stored only on your device - never uploaded.</p>
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <label className={labelCls}>Business name</label>
          <input className={inputCls} value={b.name} onChange={e => setB({ ...b, name: e.target.value })} placeholder="Acme Plumbing" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Email</label>
            <input className={inputCls} value={b.email} onChange={e => setB({ ...b, email: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={b.phone} onChange={e => setB({ ...b, phone: e.target.value })} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Address</label>
          <input className={inputCls} value={b.address} onChange={e => setB({ ...b, address: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>License # (optional)</label>
          <input className={inputCls} value={b.license} onChange={e => setB({ ...b, license: e.target.value })} />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <button onClick={save} className="bg-primary hover:bg-primary text-white px-5 py-2.5 rounded-lg font-medium">Save</button>
        <button onClick={onDone} className="px-5 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50">Cancel</button>
      </div>
    </div>
  );
}
