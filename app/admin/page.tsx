'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

type TabType = 'projects' | 'technologies' | 'badges' | 'messages' | 'settings' | 'password';

interface Technology {
  id: number;
  name: string;
}

interface Badge {
  id: number;
  name: string;
  color: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  project_url?: string;
  badges: Badge[];
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  project_type: string;
  message: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Navbar isAdmin={true} />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-l border-slate-100 bg-white h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
          <nav className="p-6 space-y-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full text-right px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              المشاريع
            </button>
            <button
              onClick={() => setActiveTab('technologies')}
              className={`w-full text-right px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'technologies'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              التقنيات
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`w-full text-right px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'badges'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              الشارات
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-right px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              الرسائل
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-right px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              الإعدادات
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`w-full text-right px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'password'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              تغيير كلمة المرور
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'technologies' && <TechnologiesTab />}
          {activeTab === 'badges' && <BadgesTab />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'password' && <PasswordTab />}
        </main>
      </div>
    </div>
  );
}

// Projects Tab Component
function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    project_url: '',
    badges: [] as number[],
  });

  useEffect(() => {
    fetchProjects();
    fetchBadges();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?page=1');
      const data = await response.json();
      setProjects(data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/badges');
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';

      const response = await fetch(url, {
        method,
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        fetchProjects();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          name: '',
          description: '',
          image_url: '',
          project_url: '',
          badges: [],
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      try {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description,
      image_url: project.image_url || '',
      project_url: project.project_url || '',
      badges: project.badges.map(b => b.id),
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">إدارة المشاريع</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) setEditingId(null);
          }}
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90"
        >
          {showForm ? 'إلغاء' : 'إضافة مشروع'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg space-y-4 border border-slate-100">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">اسم المشروع</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">رابط الصورة</label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setFormData({ ...formData, image_url: event.target?.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">رابط المشروع</label>
            <input
              type="url"
              value={formData.project_url}
              onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الشارات</label>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <label key={badge.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.badges.includes(badge.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          badges: [...formData.badges, badge.id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          badges: formData.badges.filter(id => id !== badge.id),
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{badge.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary/90"
          >
            {editingId ? 'تحديث' : 'إضافة'}
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-4 rounded-lg border border-slate-100 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900">{project.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(project)}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Technologies Tab Component
function TechnologiesTab() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [newTech, setNewTech] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      const response = await fetch('/api/technologies');
      const data = await response.json();
      setTechnologies(data);
    } catch (error) {
      console.error('Error fetching technologies:', error);
    }
  };

  const handleAdd = async () => {
    if (!newTech.trim()) return;
    try {
      const response = await fetch('/api/technologies', {
        method: 'POST',
        body: JSON.stringify({ name: newTech }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setNewTech('');
        fetchTechnologies();
      }
    } catch (error) {
      console.error('Error adding technology:', error);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editValue.trim()) return;
    try {
      const response = await fetch(`/api/technologies/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editValue }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setEditingId(null);
        fetchTechnologies();
      }
    } catch (error) {
      console.error('Error updating technology:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/technologies/${id}`, { method: 'DELETE' });
      fetchTechnologies();
    } catch (error) {
      console.error('Error deleting technology:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">التقنيات</h2>

      <div className="bg-white p-6 rounded-lg border border-slate-100 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            placeholder="إضافة تقنية جديدة"
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
          >
            إضافة
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {technologies.map((tech) => (
          <div key={tech.id} className="bg-white p-4 rounded-lg border border-slate-100 flex justify-between items-center">
            {editingId === tech.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg"
              />
            ) : (
              <span className="font-medium text-slate-900">{tech.name}</span>
            )}
            <div className="flex gap-2">
              {editingId === tech.id ? (
                <button
                  onClick={() => handleUpdate(tech.id)}
                  className="px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium"
                >
                  حفظ
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(tech.id);
                    setEditValue(tech.name);
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
                >
                  تعديل
                </button>
              )}
              <button
                onClick={() => handleDelete(tech.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Badges Tab Component
function BadgesTab() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadge, setNewBadge] = useState({ name: '', color: '#2b8cee' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState({ name: '', color: '' });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/badges');
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const handleAdd = async () => {
    if (!newBadge.name.trim()) return;
    try {
      const response = await fetch('/api/badges', {
        method: 'POST',
        body: JSON.stringify(newBadge),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setNewBadge({ name: '', color: '#2b8cee' });
        fetchBadges();
      }
    } catch (error) {
      console.error('Error adding badge:', error);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`/api/badges/${id}`, {
        method: 'PUT',
        body: JSON.stringify(editValue),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setEditingId(null);
        fetchBadges();
      }
    } catch (error) {
      console.error('Error updating badge:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/badges/${id}`, { method: 'DELETE' });
      fetchBadges();
    } catch (error) {
      console.error('Error deleting badge:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">الشارات</h2>

      <div className="bg-white p-6 rounded-lg border border-slate-100 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            value={newBadge.name}
            onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
            placeholder="اسم الشارة"
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="color"
            value={newBadge.color}
            onChange={(e) => setNewBadge({ ...newBadge, color: e.target.value })}
            className="px-4 py-2 border border-slate-200 rounded-lg"
          />
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
          >
            إضافة
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {badges.map((badge) => (
          <div key={badge.id} className="bg-white p-4 rounded-lg border border-slate-100 flex justify-between items-center">
            {editingId === badge.id ? (
              <div className="flex-1 flex gap-4">
                <input
                  type="text"
                  value={editValue.name}
                  onChange={(e) => setEditValue({ ...editValue, name: e.target.value })}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg"
                />
                <input
                  type="color"
                  value={editValue.color}
                  onChange={(e) => setEditValue({ ...editValue, color: e.target.value })}
                  className="px-4 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span
                  className="px-4 py-2 rounded text-white font-medium"
                  style={{ backgroundColor: badge.color }}
                >
                  {badge.name}
                </span>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === badge.id ? (
                <button
                  onClick={() => handleUpdate(badge.id)}
                  className="px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium"
                >
                  حفظ
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(badge.id);
                    setEditValue({ name: badge.name, color: badge.color });
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
                >
                  تعديل
                </button>
              )}
              <button
                onClick={() => handleDelete(badge.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Messages Tab Component
function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      try {
        await fetch(`/api/contact/${id}`, { method: 'DELETE' });
        fetchMessages();
        setSelectedMessage(null);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">الرسائل الواردة</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`w-full text-right p-4 rounded-lg border transition-all ${
                selectedMessage?.id === msg.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="font-bold text-slate-900">{msg.name}</div>
              <div className="text-sm text-slate-500">{msg.email}</div>
              <div className="text-xs text-slate-400 mt-1">{new Date(msg.created_at).toLocaleDateString('ar')}</div>
            </button>
          ))}
        </div>

        <div className="col-span-2">
          {selectedMessage ? (
            <div className="bg-white p-6 rounded-lg border border-slate-100 space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700">الاسم</label>
                <p className="text-slate-900">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                <p className="text-slate-900">{selectedMessage.email}</p>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700">نوع المشروع</label>
                <p className="text-slate-900">{selectedMessage.project_type}</p>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700">الرسالة</label>
                <p className="text-slate-900 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100"
              >
                حذف الرسالة
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg border border-slate-100 text-center text-slate-500">
              اختر رسالة لعرض التفاصيل
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab() {
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/button');
      const data = await response.json();
      setButtonText(data.label || '');
      setButtonUrl(data.url || '');
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/button', {
        method: 'PUT',
        body: JSON.stringify({ label: buttonText, url: buttonUrl }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        alert('تم حفظ الإعدادات بنجاح');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">الإعدادات</h2>

      <div className="bg-white p-6 rounded-lg border border-slate-100 space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            نص الزر "احجز استشارة"
          </label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            رابط الزر
          </label>
          <input
            type="text"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 disabled:bg-primary/50"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>
    </div>
  );
}

// Password Tab Component
function PasswordTab() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('تم تغيير كلمة المرور بنجاح');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage(data.error || 'حدث خطأ');
      }
    } catch (error) {
      setMessage('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">تغيير كلمة المرور</h2>

      <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-lg border border-slate-100 space-y-4 max-w-md">
        {message && (
          <div className={`p-4 rounded-lg ${message.includes('بنجاح') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور الحالية</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور الجديدة</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">تأكيد كلمة المرور</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 disabled:bg-primary/50"
        >
          {loading ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
        </button>
      </form>
    </div>
  );
}
