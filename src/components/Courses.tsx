import { Download, Sparkles } from 'lucide-react';
import { Course } from '../types';

interface CoursesProps {
  courses: Course[];
  onDownload: (courseId: string) => void;
}

export default function Courses({ courses, onDownload }: CoursesProps) {
  return (
    <section id="courses-section" className="py-16 bg-white border-b border-slate-100 relative text-left">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
          <span className="text-xs font-black tracking-widest text-[#2563EB] uppercase">EDUCATIONAL RESOURCE CENTER</span>
          <h2 className="text-3xl font-black text-[#0B1120] sm:text-4xl leading-tight">
            Free PDF Creator Courses
          </h2>
          <p className="text-slate-600 font-medium">
            Acquire actionable growth guidelines, payout resolution worksheets, and horizontal vertical editing templates crafted directly by Montu Baruah.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 font-bold max-w-md mx-auto">
            No courses available right now. We are editing useful PDFs. Please check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                 key={course.id} 
                 className={`flex flex-col h-full rounded-2xl bg-white border p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group ${
                   course.isComingSoon 
                      ? 'border-slate-100 bg-slate-50/40 opacity-90'
                      : 'border-slate-200'
                 }`}
              >
                {/* Image block */}
                <div className="relative h-48 w-full rounded-xl overflow-hidden mb-5 bg-slate-100">
                  <img 
                     src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&auto=format&fit=crop&q=60'} 
                     alt={course.title} 
                     className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category overlay */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200/50 px-2.5 py-1 text-[10px] font-black text-slate-700 uppercase tracking-wider">
                      {course.category}
                    </span>
                  </div>

                  {course.isComingSoon && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4">
                      <Sparkles className="h-6 w-6 text-[#22D3EE] mb-2 animate-pulse" />
                      <span className="text-xs font-black text-[#22D3EE] uppercase tracking-widest">COMING SOON</span>
                      <p className="text-[10px] text-slate-300 font-medium text-center mt-1">We are compiling this rich guide.</p>
                    </div>
                  )}
                </div>

                {/* Info block */}
                <h3 className="text-base font-bold text-[#0B1120] mb-2 group-hover:text-[#2563EB] transition-colors leading-snug line-clamp-2">
                  {course.title}
                </h3>
                 
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-grow line-clamp-3">
                  {course.description}
                </p>

                {/* Action block */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-auto">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">File Size</span>
                    <span className="text-xs font-bold text-slate-700">{course.isComingSoon ? 'TBD' : course.fileSize}</span>
                  </div>

                  {course.isComingSoon ? (
                    <button
                      disabled
                      className="flex items-center gap-1.5 rounded-lg bg-slate-200 text-slate-500 font-bold px-4 py-2.5 text-xs uppercase"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <button
                      onClick={() => onDownload(course.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-black px-4 py-2.5 text-xs uppercase tracking-wider transition active:scale-95 shadow-md shadow-blue-200/40 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      DOWNLOAD PDF
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
