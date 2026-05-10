import Dexie, { type EntityTable } from 'dexie';

interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
}

interface Sale {
  id: string;
  user_id: string;
  total_amount: number;
  items: any[];
  synced: boolean;
  created_at: Date;
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

const db = new Dexie('TivaroPOS') as Dexie & {
  products: EntityTable<Product, 'id'>;
  sales: EntityTable<Sale, 'id'>;
  customers: EntityTable<Customer, 'id'>;
};

// Schema declaration:
db.version(2).stores({
  products: 'id, name, sku',
  sales: 'id, synced, created_at',
  customers: 'id, name, phone'
});

export type { Product, Sale, Customer };
export { db };
