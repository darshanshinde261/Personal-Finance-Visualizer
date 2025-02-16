// src/app/api/transactions/route.js
import {connectDB} from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();

    // Validate required fields
    if (!body.amount || !body.description || !body.category) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Create and save the transaction
    const newTransaction = new Transaction(body);
    await newTransaction.save();

    return new Response(
      JSON.stringify(newTransaction),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving transaction:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save transaction' }),
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectDB();

    // Fetch all transactions sorted by date (newest first)
    const transactions = await Transaction.find().sort({ date: -1 });

    // Return the transactions as JSON
    return new Response(JSON.stringify(transactions), { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch transactions' }),
      { status: 500 }
    );
  }
}