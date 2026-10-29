import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { FileText, Code, Database, Layout, Clock, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';

export default function Blueprints() {
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null); // Controls the Master-Detail view

  useEffect(() => {
    const fetchBlueprints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('leads_prds')
        .select('*')
        .eq('agency_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBlueprints(data);
      }
      setLoading(false);
    };

    fetchBlueprints();
  }, []);

  // --- DETAIL VIEW (The actual PRD Document) ---
  if (selectedDoc) {
    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Document Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => setSelectedDoc(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors w-fit"
          >
            <ArrowLeft size={20} /> Back to Blueprints
          </button>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <Download size={16} /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
              <CheckCircle2 size={16} /> Mark as Approved
            </button>
          </div>
        </div>

        {/* The PRD Document */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          
          {/* Doc Header */}
          <div className="p-8 md:p-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F19]/50">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold mb-4 uppercase tracking-widest">
              Generated Architecture Blueprint
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
              {selectedDoc.client_name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl">
              {selectedDoc.project_summary}
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Tech Stack Recommendation */}
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Code className="text-indigo-500" /> Recommended Stack
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800/60">
                  <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Layout size={16}/> Frontend</p>
                  <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {selectedDoc.recommended_tech_stack?.frontend || 'React / Vite'}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800/60">
                  <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Code size={16}/> Backend</p>
                  <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {selectedDoc.recommended_tech_stack?.backend || 'FastAPI (Python)'}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800/60">
                  <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Database size={16}/> Database</p>
                  <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {selectedDoc.recommended_tech_stack?.database || 'PostgreSQL (Supabase)'}
                  </p>
                </div>
              </div>
            </section>

            {/* Core Features / Requirements */}
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                <FileText className="text-indigo-500" /> Core Features & Requirements
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {/* Fallback for when the AI hasn't structured the JSON yet and it's just raw form data */}
                {typeof selectedDoc.core_features === 'string' ? (
                  <div className="p-6 bg-slate-50 dark:bg-[#0B0F19] rounded-2xl whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                    {selectedDoc.core_features}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {selectedDoc.core_features?.map((feature, idx) => (
                      <li key={idx} className="p-6 bg-slate-50 dark:bg-[#0B0F19] rounded-2xl border border-slate-100 dark:border-slate-800/60">
                        <h4 className="text-lg font-bold m-0">{feature.title || 'Feature'}</h4>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 mb-0">{feature.description}</p>
                        {feature.user_story && (
                          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm italic border border-indigo-100 dark:border-indigo-500/20">
                            "{feature.user_story}"
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // --- MASTER VIEW (Grid of all PRDs) ---
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Architecture Blueprints</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review and export AI-generated technical requirement documents.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 animate-pulse">Loading blueprints...</div>
      ) : blueprints.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-[#111827]/50">
          <p className="text-slate-500 dark:text-slate-400">No blueprints generated yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprints.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col h-full"
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  v1.0
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{doc.client_name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 flex-grow">
                {doc.project_summary}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock size={14} /> {doc.estimated_hours || 'TBD'} hrs
                </span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View PRD &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}