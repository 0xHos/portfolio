'use client';

import React, { useEffect, useState } from 'react';

interface Technology {
  id: number;
  name: string;
}

export default function TechnologyCarousel() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);

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

  if (technologies.length === 0) return null;

  const firstRow = technologies.slice(0, Math.ceil(technologies.length ));
//   const secondRow = technologies.slice(Math.ceil(technologies.length / 2));

  return (
    <div className="space-y-2">
      {/* First Row - RTL Animation */}
      <div className="relative overflow-hidden">
        <div className="flex gap-12 animate-scroll-rtl">
          {[...firstRow, ...firstRow].map((tech, index) => (
            <div key={`rtl-${index}`} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black text-slate-700 whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - LTR Animation */}
      {/* <div className="relative overflow-hidden">
        <div className="flex gap-12 animate-scroll-ltr">
          {[...secondRow, ...secondRow].map((tech, index) => (
            <div key={`ltr-${index}`} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black text-slate-700 whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div> */}

      <style>{`
        @keyframes scroll-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-ltr {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50%);
          }
        }

        .animate-scroll-rtl {
          animation: scroll-rtl 30s linear infinite;
        }

        .animate-scroll-ltr {
          animation: scroll-ltr 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
