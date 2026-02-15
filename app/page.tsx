'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TechnologyCarousel from '@/components/TechnologyCarousel';
import ProjectCard from '@/components/ProjectCard';

interface Project {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  project_url?: string;
  badges: any[];
}

interface ButtonSettings {
  label: string;
  url: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [buttonSettings, setButtonSettings] = useState<ButtonSettings>({
    label: 'احجز استشارة مجانية',
    url: '#contact',
  });

  useEffect(() => {
    fetchProjects();
    fetchButtonSettings();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?page=1');
      const data = await response.json();
      setProjects(data.data.slice(0, 2)); // Show first 2 projects on homepage
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

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
    <div className="min-h-screen bg-background-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(43,140,238,0.06),transparent_60%)]"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(43,140,238,0.04),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              متاح لاستلام مشاريع  جديدة
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.15] text-slate-900 text-balance max-w-4xl">
              أبني تجارب رقمية <span className="text-primary">عالية الأداء</span> تحقق نتائج فعلية
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-2xl font-medium">
              مطور واجهات برمجية متكامل وبناء المنتجات الرقمية القابلة للتوسع. أساعد الشركات الناشئة على تحويل أفكارها إلى واقع تقني ملموس.
            </p>
            <div className="flex justify-center pt-4">
              <a
                href={buttonSettings.url}
                className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all shadow-2xl shadow-primary/30 flex items-center gap-3 hover:-translate-y-1"
              >
                <span>{buttonSettings.label}</span>
                <span className="material-symbols-outlined">calendar_today</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section with Carousel */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-12">
            التقنيات الحديثة التي أعتمد عليها
          </p>
          <TechnologyCarousel />
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12" id="projects">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold text-slate-900">مشاريع مختارة</h2>
              <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                نظرة سريعة على بعض التطبيقات التي ساعدت العملاء على تحقيق أهدافهم التجارية.
              </p>
            </div>
            <div className="flex items-center">
              <Link
                href="/projects"
                className="group flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all underline-offset-4 hover:underline"
              >
                <span>تصفح المعرض الكامل</span>
                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
                  arrow_back
                </span>
              </Link>
            </div>
          </div>

          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          ) : (
           <div className="grid md:grid-cols-2 gap-8 mb-12">
  {[...Array(2)].map((_, i) => (
    <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
  ))}
</div>

          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-slate-50" id="contact">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">لنتحدث عن مشروعك</h2>
              <p className="text-xl text-slate-500 leading-relaxed">
                سواء كنت تبحث عن تطوير منتج جديد أو تحسين نظام قائم، أنا هنا للمساعدة بخبرتي التقنية. املأ النموذج أدناه وسأتواصل معك قريباً.
              </p>
            </div>
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-right">
              <form className="space-y-8" action="/api/contact" method="POST" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  project_type: formData.get('project_type'),
                  message: formData.get('message'),
                };
                fetch('/api/contact', {
                  method: 'POST',
                  body: JSON.stringify(data),
                  headers: { 'Content-Type': 'application/json' },
                }).then(() => {
                  alert('تم إرسال رسالتك بنجاح');
                  e.currentTarget?.reset();
                });
              }}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold pr-1 text-slate-700">الاسم الكامل</label>
                    <input
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                      placeholder="كامل محمد"
                      type="text"
                      name="name"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold pr-1 text-slate-700">البريد الإلكتروني</label>
                    <input
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                      placeholder="example@mail.com"
                      type="email"
                      name="email"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold pr-1 text-slate-700">نوع المشروع</label>
                  <select
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all font-medium appearance-none"
                    name="project_type"
                    required
                  >
                    <option>تطبيق ويب SaaS</option>
                    <option>تطبيق جوال</option>
                    <option>استشارة تقنية</option>
                    <option>أخرى</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold pr-1 text-slate-700">رسالتك</label>
                  <textarea
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    placeholder="كيف يمكنني مساعدتك؟"
                    rows={5}
                    name="message"
                    required
                  ></textarea>
                </div>
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl font-extrabold text-xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 transform"
                  type="submit"
                >
                  إرسال الرسالة
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/40 rounded-full blur-[100px]"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.2] text-balance">
              هل لديك فكرة مشروع تريد تحويلها إلى واقع؟
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium">
              لنناقش مشروعك القادم وكيف يمكن لخبرتي التقنية أن تساهم في نجاحه ونمو أعمالك.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <a
                href="#contact"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-12 py-6 rounded-2xl text-xl font-bold transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 hover:-translate-y-1"
              >
                <span className="material-symbols-outlined">chat_bubble</span>
                <span>ابدأ المحادثة الآن</span>
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm px-12 py-6 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-4"
              >
                <span className="material-symbols-outlined">event</span>
                <span>حجز موعد استشارة</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-2 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          برمج بكل حب بواسطة <span className="text-slate-600 font-bold">Hossam</span>
        </p>
      </footer>
    </div>
  );
}