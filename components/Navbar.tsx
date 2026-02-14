'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin }: NavbarProps) {
  const [buttonSettings, setButtonSettings] = useState({
    label: 'احجز استشارة مجانية',
    url: '#contact',
  });

  useEffect(() => {
    if (!isAdmin) {
      fetchButtonSettings();
    }
  }, [isAdmin]);

  const fetchButtonSettings = async () => {
    try {
      const response = await fetch('/api/settings/button');
      const data = await response.json();
      if (data.label && data.url) {
        setButtonSettings(data);
      }
    } catch (error) {
      console.error('Error fetching button settings:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-light backdrop-blur-xl border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-icons text-xl">code</span>
            </span>
            <span className="tracking-tight">مُطَوِّرٌ</span>
          </Link>
          <ul className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-500">
            <li>
              <Link href="/" className="text-primary hover:text-primary transition-colors">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-primary transition-colors">
                المشاريع
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors">
                تواصل معي
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  لوحة التحكم
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center gap-6">
          {!isAdmin && (
            <a
              href={buttonSettings.url}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/25"
            >
              {buttonSettings.label}
            </a>
          )}
          {isAdmin && (
            <Link
              href="/admin/logout"
              className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all"
            >
              تسجيل الخروج
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
