'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      project_type: formData.get('project_type'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setSubmitted(true);
        e.currentTarget.reset();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ في إرسال الرسالة');
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <Navbar />

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold text-slate-900">تواصل معي</h1>
              <p className="text-xl text-slate-500 leading-relaxed">
                هل لديك مشروع تريد تطويره أو فكرة تريد تحويلها إلى واقع؟ أنا هنا للمساعدة والاستشارة. 
                {' '}<br />
                يمكنك ملء النموذج أدناه وسأرد عليك في أقرب وقت.
              </p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-right">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <span className="material-icons text-green-600 text-3xl">check</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">تم الإرسال بنجاح!</h3>
                  <p className="text-slate-500">شكراً لتواصلك معي، سأرد عليك قريباً</p>
                </div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>
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
                      rows={8}
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
              )}
            </div>

            {/* <div className="grid md:grid-cols-3 gap-8 pt-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full">
                  <span className="material-symbols-outlined text-primary">mail</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">البريد الإلكتروني</h3>
                <p className="text-slate-500">contact@example.com</p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full">
                  <span className="material-symbols-outlined text-primary">phone</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">الهاتف</h3>
                <p className="text-slate-500">+966 50 000 0000</p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">أوقات العمل</h3>
                <p className="text-slate-500">السبت - الخميس: 9ص - 6م</p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          برمج بكل حب بواسطة <span className="text-slate-600 font-bold">Hossam</span>
        </p>
      </footer>
    </div>
  );
}
