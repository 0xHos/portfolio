import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

function getAuthToken(req: NextRequest): string | null {
  const token = req.cookies.get('auth_token')?.value;
  return token || null;
}

export async function PUT(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Old password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters' },
        { status: 400 }
      );
    }

    const db = getDb();
    const user = db
      .prepare('SELECT * FROM users WHERE username = ?')
      .get('admin') as any;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'كلمة المرور الحالية غير صحيحة' },
        { status: 401 }
      );
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare(
      'UPDATE users SET password = ? WHERE id = ?'
    ).run(hashedNewPassword, user.id);

    return NextResponse.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
