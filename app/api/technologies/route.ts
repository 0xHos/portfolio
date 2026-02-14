import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const technologies = db.prepare('SELECT * FROM technologies ORDER BY id').all() as any[];
    return NextResponse.json(technologies);
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch technologies' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Technology name is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = db.prepare(
      'INSERT INTO technologies (name) VALUES (?)'
    ).run(name.trim());

    return NextResponse.json(
      { id: result.lastInsertRowid, name },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'التقنية موجودة بالفعل' },
        { status: 409 }
      );
    }
    console.error('Error creating technology:', error);
    return NextResponse.json(
      { error: 'Failed to create technology' },
      { status: 500 }
    );
  }
}
