import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Search, Filter, MoreVertical, Clock, Sparkles, ArrowRight } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('leads_prds')
        .select('*')
        .eq('agency_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLeads(data);
      }
      setLoading(false);
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => 
    lead.client_name?.toLowerCase().includes(search.toLowerCase()) || 
    lead.project_summary?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leads & Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage incoming discovery requests and PRD statuses.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search clients or projects..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
                <th className="p-5">Client / Project</th>
                <th className="p-5">Status</th>
                <th className="p-5">Est. Effort</th>
                <th className="p-5">Date Received</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500 animate-pulse">Loading leads...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <Sparkles size={24} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No leads found.</p>
                    <p className="text-sm text-slate-400 mt-1">Share your Intake Link to get started.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    
                    <td className="p-5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{lead.client_name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-md mt-1">
                        {lead.project_summary}
                      </p>
                    </td>

                    <td className="p-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                        <Clock size={12} /> Pending Blueprint
                      </span>
                    </td>

                    <td className="p-5">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {lead.estimated_hours ? `${lead.estimated_hours} hrs` : 'TBD'}
                      </span>
                    </td>

                    <td className="p-5">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 text-sm font-bold">
                          Review <ArrowRight size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}