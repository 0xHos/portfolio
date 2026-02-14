import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
export async function GET() {
     try {  const db = getDb();
           const settings = db     .prepare('SELECT * FROM button_settings WHERE key = ?')     .get('consultation_button') as any;
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
    db.prepare(
      'UPDATE button_settings SET label = ?, url = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?'
    ).run(label, url, 'consultation_button');

    return NextResponse.json({ label, url });
  } catch (error) {
    console.error('Error updating button settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
