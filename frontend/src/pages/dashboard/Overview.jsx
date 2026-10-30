import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext, Link } from 'react-router-dom';
import { Users, PhoneCall, Link as LinkIcon, Activity, ArrowRight } from 'lucide-react';

export default function Overview() {
  const { workspace } = useOutletContext();
  const [stats, setStats] = useState({ totalLeads: 0, activeLinks: 0, recentLeads: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!workspace) return;

      const [leadsRes, linksRes] = await Promise.all([
        supabase.from('leads_prds').select('id, client_name, project_summary, created_at, estimated_hours').eq('agency_id', workspace.id).order('created_at', { ascending: false }),
        supabase.from('intake_links').select('id').eq('workspace_id', workspace.id).eq('is_active', true)
      ]);

      setStats({
        totalLeads: leadsRes.data?.length || 0,
        activeLinks: linksRes.data?.length || 0,
        recentLeads: leadsRes.data?.slice(0, 5) || []
      });
      setLoading(false);
    };
    fetchDashboardData();
  }, [workspace]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Overview</h1>
        <p className="text-zinc-500 text-sm mt-1">Welcome back to Archivox. Here is your discovery pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Discovery Leads", value: stats.totalLeads, icon: Users, link: "/dashboard/leads" },
          { title: "Active Intake Portals", value: stats.activeLinks, icon: LinkIcon, link: "/dashboard/links" },
          { title: "Avg. Discovery Time", value: "5m 20s", icon: PhoneCall, link: null }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-600 dark:text-zinc-400"><item.icon size={20} /></div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{loading ? '-' : item.value}</h3>
              <p className="text-sm font-medium text-zinc-500">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/20">
          <h2 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2"><Activity size={18}/> Recent Discoveries</h2>
          <Link to="/dashboard/leads" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">View all <ArrowRight size={14}/></Link>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {loading ? (
            <div className="p-8 text-center text-zinc-500 text-sm animate-pulse">Loading activity...</div>
          ) : stats.recentLeads.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-zinc-900 dark:text-white font-medium mb-1">No leads yet</p>
              <p className="text-sm text-zinc-500 mb-4">Create an intake link and share it with a client.</p>
              <Link to="/dashboard/links" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90">Create Link</Link>
            </div>
          ) : (
            stats.recentLeads.map(lead => (
              <div key={lead.id} className="p-6 flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">{lead.client_name}</p>
                  <p className="text-sm text-zinc-500 line-clamp-1 max-w-lg mt-0.5">{lead.project_summary}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold rounded uppercase tracking-wider mb-1">PRD Ready</span>
                  <p className="text-xs text-zinc-400">{new Date(lead.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}