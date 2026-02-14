'use client';

import React from 'react';

interface Badge {
  id: number;
  name: string;
  color: string;
}

interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  project_url?: string;
  badges: Badge[];
}

export default function ProjectCard({
  id,
  name,
  description,
  image_url,
  project_url,
  badges,
}: ProjectCardProps) {
  return (
    <div className="group flex flex-col space-y-6">
      <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 bg-slate-100 shadow-sm transition-all group-hover:shadow-2xl group-hover:shadow-primary/10">
        {image_url ? (
          <img
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={image_url}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-slate-400 text-lg">بدون صورة</span>
          </div>
        )}
        {project_url && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
            <a
              href={project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <span>عرض المشروع</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        )}
      </div>
      <div className="space-y-4 pr-2">
        {badges.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {badges.map((badge) => (
              <span
                key={badge.id}
                className="text-xs font-black tracking-widest text-white uppercase px-3 py-1 rounded-md"
                style={{ backgroundColor: badge.color }}
              >
                {badge.name}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-3xl font-extrabold group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-lg text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
