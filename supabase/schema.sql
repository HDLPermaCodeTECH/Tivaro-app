-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table products (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  sku text,
  quantity integer not null default 0,
  unit text not null default 'pcs',
  cost_price decimal(12,2) not null default 0,
  selling_price decimal(12,2) not null default 0,
  low_stock_threshold integer not null default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sales Table
create table sales (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null default auth.uid(),
  total_amount decimal(12,2) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sale Items Table
create table sale_items (
  id uuid primary key default uuid_generate_v4(),
  sale_id uuid references sales(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  quantity integer not null,
  price decimal(12,2) not null,
  cost_price decimal(12,2) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Expenses Table
create table expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null default auth.uid(),
  description text not null,
  amount decimal(12,2) not null default 0,
  category text not null default 'General',
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Receipts Table
create table receipts (
  id uuid primary key default uuid_generate_v4(),
  sale_id uuid references sales(id) on delete cascade not null,
  receipt_number text not null unique,
  pdf_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table products enable row level security;
alter table sales enable row level security;
alter table sale_items enable row level security;
alter table receipts enable row level security;
alter table expenses enable row level security;

-- Policies
create policy "Users can only see their own products" on products for all using (auth.uid() = user_id);
create policy "Users can only see their own sales" on sales for all using (auth.uid() = user_id);
create policy "Users can only see items from their sales" on sale_items for all using (
  exists (select 1 from sales where sales.id = sale_items.sale_id and sales.user_id = auth.uid())
);
create policy "Users can only see receipts from their sales" on receipts for all using (
  exists (select 1 from sales where sales.id = receipts.sale_id and sales.user_id = auth.uid())
);
create policy "Users can only see their own expenses" on expenses for all using (auth.uid() = user_id);

-- Atomic Sale RPC
create or replace function create_sale(
  p_items jsonb,
  p_total_amount decimal
) returns uuid as $$
declare
  v_sale_id uuid;
  v_item jsonb;
  v_product_id uuid;
  v_quantity integer;
  v_price decimal;
  v_cost_price decimal;
begin
  -- 1. Create Sale Record
  insert into sales (total_amount, user_id)
  values (p_total_amount, auth.uid())
  returning id into v_sale_id;

  -- 2. Process Items
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;
    v_price := (v_item->>'price')::decimal;

    -- Get current cost price and validate stock availability
    select cost_price into v_cost_price from products 
    where id = v_product_id and quantity >= v_quantity;

    if not found then
      raise exception 'Hindi sapat ang stock para sa produktong ito.';
    end if;

    -- 3. Create Sale Item
    insert into sale_items (sale_id, product_id, quantity, price, cost_price)
    values (v_sale_id, v_product_id, v_quantity, v_price, v_cost_price);

    -- 4. Deduct Inventory
    update products 
    set quantity = quantity - v_quantity
    where id = v_product_id;
  end loop;

  -- 5. Create Receipt metadata
  insert into receipts (sale_id, receipt_number)
  values (v_sale_id, 'REC-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(v_sale_id::text, 1, 8)));

  return v_sale_id;
end;
$$ language plpgsql security definer;
