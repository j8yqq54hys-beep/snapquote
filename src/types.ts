export type LineItem = {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
};

export type BusinessInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  license: string;
};

export type Quote = {
  id: string;
  createdAt: number;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  jobDescription: string;
  lineItems: LineItem[];
  taxRate: number;
  discount: number;
  notes: string;
  validDays: number;
  business: BusinessInfo;
};
