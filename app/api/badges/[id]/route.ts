import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const db = getDb();
    const badge = db
      .prepare('SELECT * FROM badges WHERE id = ?')
      .get(id) as any;

    if (!badge) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(badge);
  } catch (error) {
    console.error('Error fetching badge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badge' },
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
    const { name, color } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Badge name is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    db.prepare(
      'UPDATE badges SET name = ?, color = ? WHERE id = ?'
    ).run(name.trim(), color || '#2b8cee', id);

    return NextResponse.json({ id, name, color: color || '#2b8cee' });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'الشارة موجودة بالفعل' },
        { status: 409 }
      );
    }
    console.error('Error updating badge:', error);
    return NextResponse.json(
      { error: 'Failed to update badge' },
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
    
    db.prepare('DELETE FROM badges WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting badge:', error);
    return NextResponse.json(
      { error: 'Failed to delete badge' },
      { status: 500 }
    );
  }
}
