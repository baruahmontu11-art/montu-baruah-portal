import { Download, Wrench, Sparkles } from 'lucide-react';
import { Tool } from '../types';

interface ToolsProps {
  tools: Tool[];
  onDownload: (toolId: string) => void;
}

export default function Tools({ tools, onDownload }: ToolsProps) {
  return (
    <section id="tools-section" className="py-16 bg-white border-b border-slate-100 relative text-left">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
          <span className="text-xs font-black tracking-widest text-[#2563EB] uppercase">DOWNLOAD CENTER</span>
          <h2 className="text-3xl font-black text-[#0B1120] sm:text-4xl leading-tight">
            Tools & Apps
          </h2>
          <p className="text-slate-600 font-medium">
            Download official apps and tools built by Montu Baruah to help you manage your creator journey.
          </p>
        </div>

        {tools.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 font-bold max-w-md mx-auto">
            No tools available right now. Please check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <div
                 key={tool.id}
                 className={`flex flex-col h-full rounded-2xl bg-white border p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group ${
                   tool.isComingSoon
                      ? 'border-slate-100 bg-slate-50/40 opacity-90'
                      : 'border-slate-200'
                 }`}
              >
                {/* 1:1 Image block */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-5 bg-slate-100">
                  {tool.imageUrl ? (
                    <img
                       src={tool.imageUrl}
                       alt={tool.name}
                       className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Wrench className="h-10 w-10 text-slate-300" />
                    </div>
                  )}

                  {tool.isComingSoon && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4">
                      <Sparkles className="h-6 w-6 text-[#22D3EE] mb-2 animate-pulse" />
                      <span className="text-xs font-black text-[#22D3EE] uppercase tracking-widest">COMING SOON</span>
                      <p className="text-[10px] text-slate-300 font-medium text-center mt-1">We are preparing this app.</p>
                    </div>
                  )}
                </div>

                {/* Info block */}
                <h3 className="text-base font-bold text-[#0B1120] mb-2 group-hover:text-[#2563EB] transition-colors leading-snug line-clamp-2">
                  {tool.name}
                </h3>

                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2 line-clamp-3">
                  {tool.description}
                </p>

                {tool.workDescription && (
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 flex-grow line-clamp-4">
                    {tool.workDescription}
                  </p>
                )}

                {/* Action block */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-auto">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">File Size</span>
                    <span className="text-xs font-bold text-slate-700">{tool.isComingSoon ? 'TBD' : (tool.fileSize || 'N/A')}</span>
                  </div>

                  {tool.isComingSoon ? (
                    <button
                      disabled
                      className="flex items-center gap-1.5 rounded-lg bg-slate-200 text-slate-500 font-bold px-4 py-2.5 text-xs uppercase"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <button
                      onClick={() => onDownload(tool.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-black px-4 py-2.5 text-xs uppercase tracking-wider transition active:scale-95 shadow-md shadow-blue-200/40 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      DOWNLOAD APP
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
