import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    const messages = result.rows as any[];
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, project_type, message } = await req.json();

    if (!name || !email || !project_type || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await db.execute({
      sql: 'INSERT INTO contact_messages (name, email, project_type, message) VALUES (?, ?, ?, ?)',
      args: [name, email, project_type, message],
    });

    return NextResponse.json(
      { id: result.lastInsertRowid, name, email, project_type, message },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
