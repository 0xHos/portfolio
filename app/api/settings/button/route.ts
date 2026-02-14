import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT * FROM button_settings WHERE key = ?',
      args: ['consultation_button'],
    });

    const settings = result.rows[0] as any;
    return NextResponse.json(settings || { label: 'احجز استشارة مجانية', url: '#contact' });
  } catch (error) {
    console.error('Error fetching button settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { label, url } = await req.json();

    if (!label || !url) {
      return NextResponse.json(
        { error: 'Label and URL are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute({
      sql: 'UPDATE button_settings SET label = ?, url = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
      args: [label, url, 'consultation_button'],
    });

    return NextResponse.json({ label, url });
  } catch (error) {
    console.error('Error updating button settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
