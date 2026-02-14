import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM badges ORDER BY id');
    const badges = result.rows as any[];
    return NextResponse.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, color } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Badge name is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await db.execute({
      sql: 'INSERT INTO badges (name, color) VALUES (?, ?)',
      args: [name.trim(), color || '#2b8cee'],
    });

    return NextResponse.json(
      { id: result.lastInsertRowid, name, color: color || '#2b8cee' },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed') || error.message?.includes('constraint')) {
      return NextResponse.json(
        { error: 'الشارة موجودة بالفعل' },
        { status: 409 }
      );
    }
    console.error('Error creating badge:', error);
    return NextResponse.json(
      { error: 'Failed to create badge' },
      { status: 500 }
    );
  }
}
