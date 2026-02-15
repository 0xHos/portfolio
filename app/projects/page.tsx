'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';

interface Project {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  project_url?: string;
  badges: any[];
}

interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects(1);
  }, []);

  const fetchProjects = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects?page=${page}`);
      const data = await response.json();
      if (page === 1) {
        setProjects(data.data);
      } else {
        setProjects((prev) => [...prev, ...data.data]);
      }
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination && pagination.hasMore) {
      fetchProjects(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <Navbar />

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-extrabold text-slate-900 mb-4">جميع المشاريع</h1>
            <p className="text-xl text-slate-500">
              تصفح المعرض الكامل للمشاريع التي طورتها ساعدت عملائي على تحقيق أهدافهم.
            </p>
          </div>

          {projects.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {projects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>

              {pagination && pagination.hasMore && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white px-12 py-6 rounded-2xl text-xl font-bold transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
                  >
                    <span>{loading ? 'جاري التحميل...' : 'تحميل المزيد'}</span>
                    {!loading && <span className="material-symbols-outlined">expand_more</span>}
                  </button>
                </div>
              )}

              {pagination && !pagination.hasMore && projects.length > 6 && (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-lg">تم تحميل جميع المشاريع</p>
                </div>
              )}
            </>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
  {[...Array(4)].map((_, i) => (
    <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
  ))}
</div>

          )}
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
