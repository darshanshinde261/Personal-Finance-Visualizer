// app/api/budgets/route.js
import {connectDB} from '@/lib/mongodb';
import Budget from '@/models/Budget';

export async function GET() {
  try {
    await connectDB();
    const budgets = await Budget.find();
    return new Response(JSON.stringify(budgets), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch budgets' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();

    // Prevent duplicate budgets
    const existing = await Budget.findOne({
      category: body.category,
      month: body.month,
      year: body.year
    });

    if (existing) {
      return new Response(JSON.stringify({ error: 'Budget already exists for this category/month' }), { status: 400 });
    }

    const newBudget = new Budget(body);
    await newBudget.save();
    return new Response(JSON.stringify(newBudget), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create budget' }), { status: 500 });
  }
}