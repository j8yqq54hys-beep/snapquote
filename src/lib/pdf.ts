import jsPDF from 'jspdf';
import type { Quote } from '../types';

export function quoteToPdf(quote: Quote): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  let y = 60;

  // Use primary text color for main headings
  doc.setTextColor(30, 41, 59); // #1e293b (primary text)
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTE', 40, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('#' + quote.id.slice(0, 8).toUpperCase(), W - 40, y, { align: 'right' });
  y += 16;
  doc.text(new Date(quote.createdAt).toLocaleDateString(), W - 40, y, { align: 'right' });
  y += 30;

  // Business header in accent color
  doc.setTextColor(107, 129, 163); // #6b81a3 (accent)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(quote.business.name || 'Your Business', 40, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59); // reset to primary text
  y += 14;
  if (quote.business.email) { doc.text(quote.business.email, 40, y); y += 12; }
  if (quote.business.phone) { doc.text(quote.business.phone, 40, y); y += 12; }
  if (quote.business.address) { doc.text(quote.business.address, 40, y); y += 12; }
  if (quote.business.license) { doc.text('License: ' + quote.business.license, 40, y); y += 12; }
  y += 12;

  // Prepared for label in primary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Prepared for:', 40, y);
  doc.setFont('helvetica', 'normal');
  y += 14;
  doc.text(quote.clientName || '-', 40, y); y += 12;
  if (quote.clientEmail) { doc.text(quote.clientEmail, 40, y); y += 12; }
  if (quote.clientAddress) {
    const lines = doc.splitTextToSize(quote.clientAddress, W - 80);
    doc.text(lines, 40, y); y += lines.length * 12;
  }
  y += 14;

  if (quote.jobDescription) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Scope of Work', 40, y); y += 14;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(quote.jobDescription, W - 80);
    doc.text(lines, 40, y); y += lines.length * 12 + 12;
  }

  // Table header row with accent background
  doc.setFillColor(178, 184, 192); // #b2b8c0 (border-slate-200 equivalent)
  doc.rect(40, y, W - 80, 20, 'F');
  doc.setTextColor(30, 41, 59); // primary text color
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 46, y + 14);
  doc.text('Qty', W - 160, y + 14, { align: 'right' });
  doc.text('Unit', W - 110, y + 14, { align: 'right' });
  doc.text('Total', W - 46, y + 14, { align: 'right' });
  y += 30;

  doc.setFont('helvetica', 'normal');
  const subtotal = quote.lineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  for (const item of quote.lineItems) {
    const desc = doc.splitTextToSize(item.description || '-', W - 200);
    doc.text(desc, 46, y);
    doc.text(String(item.qty), W - 160, y, { align: 'right' });
    doc.text('$' + item.unitPrice.toFixed(2), W - 110, y, { align: 'right' });
    doc.text('$' + (item.qty * item.unitPrice).toFixed(2), W - 46, y, { align: 'right' });
    y += Math.max(14, desc.length * 12) + 4;
  }

  y += 8;
  // Subtle line separator using border color
  doc.setDrawColor(237, 239, 242); // #edeff2 (slightly lighter than #e5e7eb for PDF)
  doc.line(W - 220, y, W - 40, y);
  y += 18;

  const discountAmt = subtotal * (quote.discount / 100);
  const taxable = subtotal - discountAmt;
  const tax = taxable * (quote.taxRate / 100);
  const total = taxable + tax;

  doc.text('Subtotal', W - 220, y);
  doc.text('$' + subtotal.toFixed(2), W - 46, y, { align: 'right' });
  y += 14;
  if (quote.discount > 0) {
    doc.text('Discount (' + quote.discount + '%)', W - 220, y);
    doc.text('-$' + discountAmt.toFixed(2), W - 46, y, { align: 'right' });
    y += 14;
  }
  if (quote.taxRate > 0) {
    doc.text('Tax (' + quote.taxRate + '%)', W - 220, y);
    doc.text('$' + tax.toFixed(2), W - 46, y, { align: 'right' });
    y += 14;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total', W - 220, y);
  doc.text('$' + total.toFixed(2), W - 46, y, { align: 'right' });
  y += 28;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  if (quote.notes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Notes', 40, y); y += 14;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(quote.notes, W - 80);
    doc.text(lines, 40, y); y += lines.length * 12 + 12;
  }

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('This quote is valid for ' + quote.validDays + ' days from the date above.', 40, y);
  y += 12;
  doc.text('This is an estimate only and does not constitute a binding contract.', 40, y);

  return doc;
}

export function downloadQuote(quote: Quote) {
  const doc = quoteToPdf(quote);
  doc.save('quote-' + quote.id.slice(0, 8) + '.pdf');
}
