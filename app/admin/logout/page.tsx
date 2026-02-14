'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('auth_token');
        router.push('/admin/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>جاري تسجيل الخروج...</p>
    </div>
  );
}
