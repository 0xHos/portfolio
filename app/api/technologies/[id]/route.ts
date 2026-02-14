import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const db = getDb();
    const technology = db
      .prepare('SELECT * FROM technologies WHERE id = ?')
      .get(id) as any;

    if (!technology) {
      return NextResponse.json(
        { error: 'Technology not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(technology);
  } catch (error) {
    console.error('Error fetching technology:', error);
    return NextResponse.json(
      { error: 'Failed to fetch technology' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const { name } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Technology name is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    db.prepare(
      'UPDATE technologies SET name = ? WHERE id = ?'
    ).run(name.trim(), id);

    return NextResponse.json({ id, name });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'التقنية موجودة بالفعل' },
        { status: 409 }
      );
    }
    console.error('Error updating technology:', error);
    return NextResponse.json(
      { error: 'Failed to update technology' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const db = getDb();
    
    db.prepare('DELETE FROM technologies WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting technology:', error);
    return NextResponse.json(
      { error: 'Failed to delete technology' },
      { status: 500 }
    );
  }
}
