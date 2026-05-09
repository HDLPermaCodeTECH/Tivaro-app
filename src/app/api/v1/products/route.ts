import { NextResponse } from 'next/server';

export async function GET() {
  // Sample data para sa API
  const products = [
    { 
      id: "prod_1", 
      name: "Barako Coffee Beans (250g)", 
      price: 250.00, 
      stock: 45, 
      category: "Coffee" 
    },
    { 
      id: "prod_2", 
      name: "Premium Jasmine Rice (5kg)", 
      price: 350.00, 
      stock: 12, 
      category: "Grains" 
    },
    { 
      id: "prod_3", 
      name: "Organic Honey (300ml)", 
      price: 180.00, 
      stock: 30, 
      category: "Sweeteners" 
    }
  ];

  return NextResponse.json({
    success: true,
    message: "Products retrieved successfully",
    data: products
  });
}
