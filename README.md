# Tivaro – Modular Business Operating System

A simple, scalable, and modular business management system for small businesses.

## Features
- **Inventory Management**: CRUD products, real-time stock tracking, and low stock alerts.
- **Sales & Transaction System**: Atomic sales processing with inventory deduction.
- **Receipt Generation**: Printable thermal-style receipts and transaction history.
- **Dashboard**: Real-time business metrics and recent activity.

## Tech Stack
- **Frontend**: Next.js 15 (React 19), Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL, Auth, RLS)

## Setup Instructions

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of `supabase/schema.sql`.
3. Go to **Project Settings > API** and copy your `URL` and `anon public` key.

### 2. Local Environment
1. Clone the repository and navigate to the root directory.
2. Create a `.env.local` file based on `.env.local.example`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Fill in your Supabase credentials.

### 3. Install & Run
```bash
npm install
npm run dev
```

## Modular Architecture
The system is designed to be future-proof. Modules are located in `src/app/(dashboard)/`:
- `/dashboard`: Metrics and overview.
- `/inventory`: Product and stock management.
- `/sales`: Cashier/Point of Sale interface.
- `/receipts`: History and printable documents.

Future modules like `/crm` and `/finance` can be easily added following this pattern.

## License
MIT
