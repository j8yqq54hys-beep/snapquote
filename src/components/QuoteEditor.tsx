import React, { useState, ChangeEvent } from 'react';
import type { Quote } from '../types';

interface QuoteEditorProps {
  quote: Quote;
  onSave: (q: Quote) => void;
  onCancel: () => void;
}

type Item = { label: string; value: string };

const QuoteEditor = ({ quote, onSave, onCancel }: QuoteEditorProps) => {
  const [title, setTitle] = useState(quote?.clientName ?? '');
  const [content, setContent] = useState(quote?.jobDescription ?? '');
  const [items, setItems] = useState<Item[]>([]);
  const [preview, setPreview] = useState('');

  const handleBack = () => {
    onCancel();
  };

  const handlePreview = () => {
    setPreview(content);
  };

  const handleDownloadPDF = () => {
    // download pdf
  };

  const handleSave = () => {
    // save
    onSave(quote);
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, { label: '', value: '' }]);
  };

  const inputCls =
    'rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-500';

  const itemCls =
    'rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-500';

  return (
    <div className="bg-white border border-slate-800 rounded-md p-4 space-y-2">
      {/* Section: Title */}
      <div className="bg-white border border-slate-800 rounded-md p-4">
        <h2 className="font-semibold text-slate-900 mb-3">Quote Title</h2>
        <div className="space-y-2">
          <label className="text-slate-900 font-semibold text-sm">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Enter quote title"
            className={inputCls}
          />
        </div>
      </div>

      {/* Section: Content */}
      <div className="bg-white border border-slate-800 rounded-md p-4">
        <h2 className="font-semibold text-slate-900 mb-3">Quote Content</h2>
        <div className="space-y-2">
          <label className="text-slate-900 font-semibold text-sm">Content</label>
          <input
            type="text"
            value={content}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
            placeholder="Enter quote content"
            className={inputCls}
          />
        </div>
      </div>

      {/* Section: Items */}
      <div className="bg-white border border-slate-800 rounded-md p-4">
        <h2 className="font-semibold text-slate-900 mb-3">Items</h2>
        <div className="space-y-2">
          {items.map((item: Item, idx: number) => (
            <div key={idx} className="space-y-1">
              <input
                type="text"
                placeholder="Item label"
                value={item.label}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newItems = [...items];
                  newItems[idx] = { ...item, label: e.target.value };
                  setItems(newItems);
                }}
                className={itemCls}
              />
              <input
                type="text"
                placeholder="Item value"
                value={item.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newItems = [...items];
                  newItems[idx] = { ...item, value: e.target.value };
                  setItems(newItems);
                }}
                className={itemCls}
              />
            </div>
          ))}
          <button
            type="button"
            className="text-sm bg-slate-200 hover:bg-slate-300 rounded-md px-2 py-1 text-sm font-medium"
            onClick={handleAddItem}
          >
            Add item
          </button>
        </div>
      </div>

      {/* Section: Action Buttons */}
      <div className="bg-white border border-slate-800 rounded-md p-4 flex flex-wrap items-center space-x-2">
        <button
          type="button"
          className="text-sm text-slate-400 hover:text-slate-600 mr-2"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center py-2 px-4 rounded-md border border-slate-300 bg-slate-50 text-sm text-slate-800 hover:bg-slate-100 transition-colors"
          onClick={handlePreview}
        >
          Preview
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center py-2 px-4 rounded-md border border-slate-300 bg-slate-50 text-sm text-slate-800 hover:bg-slate-100 transition-colors"
          onClick={handleDownloadPDF}
        >
          Download PDF
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center py-2 px-4 rounded-md bg-accent text-white hover:bg-indigo-700 transition-colors font-medium"
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      {/* Preview Card */}
      <div
        className="bg-white border border-slate-800 rounded-md p-4 mt-4"
      >
        <h3 className="font-semibold text-slate-900 mb-2">Preview</h3>
        <p className="text-slate-800">{preview || 'No preview available'}</p>
      </div>
    </div>
  );
};

export default QuoteEditor;
