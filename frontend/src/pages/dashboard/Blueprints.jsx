import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext } from 'react-router-dom';
import { FileText, Code, Database, Layout, Clock, ArrowLeft, Download, CheckCircle2, Loader2 } from 'lucide-react';

export default function Blueprints() {
  const { workspace } = useOutletContext();
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null); 
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const fetchBlueprints = async () => {
      if (!workspace) return;
      const { data, error } = await supabase
        .from('leads_prds')
        .select('*')
        .eq('agency_id', workspace.id) 
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBlueprints(data);
      }
      setLoading(false);
    };
    fetchBlueprints();
  }, [workspace]);

  // Handle Mark as Approved
  const handleApprove = async () => {
    if (!selectedDoc) return;
    setApproving(true);
    
    // Attempt to update status in Supabase (Assumes a 'status' column exists, if not it just updates local state)
    await supabase.from('leads_prds').update({ status: 'approved' }).eq('id', selectedDoc.id);
    
    // Update local state instantly
    const updatedDoc = { ...selectedDoc, status: 'approved' };
    setSelectedDoc(updatedDoc);
    setBlueprints(blueprints.map(b => b.id === updatedDoc.id ? updatedDoc : b));
    
    setApproving(false);
    alert('Blueprint marked as Approved!');
  };

  // Handle Export to PDF (Creates a temporary print window)
  const handleExportPDF = () => {
    const printContent = document.getElementById('prd-print-area').innerHTML;
    const printWindow = window.open('', '', 'width=900,height=900');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedDoc.client_name} - PRD Blueprint</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body class="p-10 font-sans bg-white text-black">
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for tailwind to load in the new window, then trigger print dialog
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  // --- DETAIL VIEW (The actual PRD Document) ---
  if (selectedDoc) {
    const isApproved = selectedDoc.status === 'approved';

    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Document Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => setSelectedDoc(null)}
            className="flex items-center gap-2 text-[#64748B] dark:text-[#9AA6B8] hover:text-[#111827] dark:hover:text-[#F3F5F9] font-medium transition-colors w-fit"
          >
            <ArrowLeft size={20} /> Back to Blueprints
          </button>
          <div className="flex gap-3">
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] dark:bg-[#151B24] border border-[#E2E8F0] dark:border-[#252D3A] rounded-lg text-sm font-medium hover:bg-[#F8FAFC] dark:hover:bg-[#0D1117] transition-colors"
            >
              <Download size={16} /> Export PDF
            </button>
            <button 
              onClick={handleApprove}
              disabled={isApproved || approving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isApproved ? 'bg-emerald-500 text-white cursor-default' : 'bg-[#111827] dark:bg-[#F3F5F9] text-[#FFFFFF] dark:text-[#111827] hover:opacity-90'}`}
            >
              {approving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} 
              {isApproved ? 'Approved' : 'Mark as Approved'}
            </button>
          </div>
        </div>

        {/* The PRD Document (Wrapper id is used for the PDF exporter) */}
        <div id="prd-print-area" className="bg-[#FFFFFF] dark:bg-[#151B24] border border-[#E2E8F0] dark:border-[#252D3A] rounded-3xl shadow-sm overflow-hidden text-left">
          
          {/* Doc Header */}
          <div className="p-8 md:p-12 border-b border-[#E2E8F0] dark:border-[#252D3A] bg-[#F8FAFC]/50 dark:bg-[#0D1117]/50">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#4F46E5]/10 dark:bg-[#A5B4FC]/10 text-[#4F46E5] dark:text-[#A5B4FC] text-xs font-bold mb-4 uppercase tracking-widest">
              Generated Architecture Blueprint
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] dark:text-[#F3F5F9] mb-2 tracking-tight">
              {selectedDoc.client_name}
            </h1>
            <p className="text-[#64748B] dark:text-[#9AA6B8] text-lg max-w-3xl">
              {selectedDoc.project_summary}
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Tech Stack Recommendation */}
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-[#E2E8F0] dark:border-[#252D3A] pb-2 text-[#111827] dark:text-[#F3F5F9]">
                <Code className="text-[#4F46E5] dark:text-[#A5B4FC]" /> Recommended Stack
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A]">
                  <p className="text-sm text-[#64748B] dark:text-[#9AA6B8] mb-1 flex items-center gap-2"><Layout size={16}/> Frontend</p>
                  <p className="font-mono font-semibold text-[#111827] dark:text-[#F3F5F9]">
                    {selectedDoc.recommended_tech_stack?.frontend || 'React / Next.js'}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A]">
                  <p className="text-sm text-[#64748B] dark:text-[#9AA6B8] mb-1 flex items-center gap-2"><Code size={16}/> Backend</p>
                  <p className="font-mono font-semibold text-[#111827] dark:text-[#F3F5F9]">
                    {selectedDoc.recommended_tech_stack?.backend || 'FastAPI / Node.js'}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A]">
                  <p className="text-sm text-[#64748B] dark:text-[#9AA6B8] mb-1 flex items-center gap-2"><Database size={16}/> Database</p>
                  <p className="font-mono font-semibold text-[#111827] dark:text-[#F3F5F9]">
                    {selectedDoc.recommended_tech_stack?.database || 'PostgreSQL'}
                  </p>
                </div>
              </div>
            </section>

            {/* Core Features / Requirements */}
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-[#E2E8F0] dark:border-[#252D3A] pb-2 text-[#111827] dark:text-[#F3F5F9]">
                <FileText className="text-[#4F46E5] dark:text-[#A5B4FC]" /> Core Features & Requirements
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {typeof selectedDoc.core_features === 'string' ? (
                  <div className="p-6 bg-[#F8FAFC] dark:bg-[#0D1117] rounded-2xl whitespace-pre-wrap text-[#111827] dark:text-[#F3F5F9] border border-[#E2E8F0] dark:border-[#252D3A]">
                    {selectedDoc.core_features}
                  </div>
                ) : (
                  <ul className="space-y-4 list-none pl-0">
                    {selectedDoc.core_features?.map((feature, idx) => (
                      <li key={idx} className="p-6 bg-[#F8FAFC] dark:bg-[#0D1117] rounded-2xl border border-[#E2E8F0] dark:border-[#252D3A]">
                        <h4 className="text-lg font-bold m-0 text-[#111827] dark:text-[#F3F5F9]">{feature.title || 'Feature'}</h4>
                        <p className="text-[#64748B] dark:text-[#9AA6B8] mt-2 mb-0">{feature.description}</p>
                        {feature.user_story && (
                          <div className="mt-4 p-4 bg-[#FFFFFF] dark:bg-[#151B24] border border-[#E2E8F0] dark:border-[#252D3A] rounded-xl text-sm italic font-medium text-[#111827] dark:text-[#F3F5F9]">
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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-[#F3F5F9]">Architecture Blueprints</h1>
        <p className="text-[#64748B] dark:text-[#9AA6B8] mt-1">Review and export AI-generated technical requirement documents.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#64748B] dark:text-[#9AA6B8] animate-pulse">Loading blueprints...</div>
      ) : blueprints.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[#E2E8F0] dark:border-[#252D3A] rounded-2xl bg-[#FFFFFF]/50 dark:bg-[#151B24]/50">
          <p className="text-[#64748B] dark:text-[#9AA6B8]">No blueprints generated yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprints.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-[#FFFFFF] dark:bg-[#151B24] border border-[#E2E8F0] dark:border-[#252D3A] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#4F46E5]/50 transition-all cursor-pointer group flex flex-col h-full"
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] text-[#111827] dark:text-[#F3F5F9] rounded-xl group-hover:scale-105 transition-transform">
                  <FileText size={24} />
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded border ${doc.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'text-[#64748B] dark:text-[#9AA6B8] bg-[#F8FAFC] dark:bg-[#0D1117] border-[#E2E8F0] dark:border-[#252D3A]'}`}>
                  {doc.status === 'approved' ? 'APPROVED' : 'v1.0'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-[#111827] dark:text-[#F3F5F9]">{doc.client_name}</h3>
              <p className="text-sm text-[#64748B] dark:text-[#9AA6B8] line-clamp-2 mb-6 flex-grow">
                {doc.project_summary}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] dark:border-[#252D3A]">
                <span className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#9AA6B8] font-medium">
                  <Clock size={14} /> {doc.estimated_hours || 'TBD'} hrs
                </span>
                <span className="text-sm font-bold text-[#111827] dark:text-[#F3F5F9] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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