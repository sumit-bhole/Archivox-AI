import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, MoreVertical, Clock, Sparkles, ArrowRight } from 'lucide-react';

export default function Leads() {
  const { workspace } = useOutletContext();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      if (!workspace) return;

      const { data, error } = await supabase
        .from('leads_prds')
        .select('*')
        .eq('agency_id', workspace.id) // Correct column mapping
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLeads(data);
      }
      setLoading(false);
    };

    fetchLeads();
  }, [workspace]);

  const filteredLeads = leads.filter(lead => 
    lead.client_name?.toLowerCase().includes(search.toLowerCase()) || 
    lead.project_summary?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Leads & Projects</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Manage incoming discovery requests and PRD statuses.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input 
          type="text" 
          placeholder="Search clients or projects..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-900 rounded-xl outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
        />
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-black/50 border-b border-zinc-200 dark:border-zinc-900 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <th className="p-5">Client / Project</th>
                <th className="p-5">Status</th>
                <th className="p-5">Est. Effort</th>
                <th className="p-5">Date Received</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
              
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-zinc-500 animate-pulse text-sm">Loading leads...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
                      <Sparkles size={24} />
                    </div>
                    <p className="text-zinc-900 dark:text-white font-medium">No leads found.</p>
                    <p className="text-sm text-zinc-500 mt-1">Share your Intake Link to get started.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors group">
                    
                    <td className="p-5">
                      <p className="font-semibold text-zinc-900 dark:text-white">{lead.client_name}</p>
                      <p className="text-sm text-zinc-500 line-clamp-1 max-w-md mt-1">
                        {lead.project_summary}
                      </p>
                    </td>

                    <td className="p-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        <Clock size={12} /> Pending Blueprint
                      </span>
                    </td>

                    <td className="p-5">
                      <span className="text-zinc-900 dark:text-white font-medium text-sm">
                        {lead.estimated_hours ? `${lead.estimated_hours} hrs` : 'TBD'}
                      </span>
                    </td>

                    <td className="p-5">
                      <span className="text-sm text-zinc-500">
                        {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
                          Review <ArrowRight size={16} />
                        </button>
                        <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
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