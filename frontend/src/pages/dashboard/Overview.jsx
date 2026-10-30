import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext } from 'react-router-dom';
import { Users, PhoneCall, FileCode, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function Overview() {
  const { workspace } = useOutletContext();
  const [stats, setStats] = useState({ leads: 0, hours: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!workspace) return;

      // Note: If you haven't renamed 'agency_id' to 'workspace_id' in your leads_prds table yet,
      // it will still work perfectly as long as it maps to the workspace.id
      const { data, error } = await supabase
        .from('leads_prds')
        .select('estimated_hours')
        .eq('agency_id', workspace.id); 

      if (!error && data) {
        const totalHours = data.reduce((acc, curr) => acc + (curr.estimated_hours || 0), 0);
        setStats({ leads: data.length, hours: totalHours });
      }
      setLoading(false);
    };
    fetchData();
  }, [workspace]);

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="p-6 bg-[#FFFFFF] dark:bg-[#151B24] rounded-2xl border border-[#E2E8F0] dark:border-[#252D3A] shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#252D3A] flex items-center justify-center text-[#64748B] dark:text-[#9AA6B8]">
          <Icon size={20} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
            <ArrowUpRight size={14} /> {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-[#111827] dark:text-[#F3F5F9]">{loading ? '-' : value}</h3>
        <p className="text-sm font-medium text-[#64748B] dark:text-[#9AA6B8] mt-1">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {workspace.name.split(' ')[0]} 👋</h1>
        <p className="text-[#64748B] dark:text-[#9AA6B8]">Here is what is happening with your client discovery pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads Scoped" value={stats.leads} icon={Users} trend="12%" />
        <StatCard title="Pipeline Est. Hours" value={stats.hours} icon={FileCode} />
        <StatCard title="AI Conversations (7d)" value="0" icon={PhoneCall} />
        <StatCard title="Blueprints Needs Review" value="0" icon={AlertCircle} />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        
        {/* Onboarding Checklist / Next Steps */}
        <div className="md:col-span-2 bg-[#FFFFFF] dark:bg-[#151B24] rounded-2xl border border-[#E2E8F0] dark:border-[#252D3A] shadow-sm p-8">
          <h3 className="text-lg font-bold mb-6 border-b border-[#E2E8F0] dark:border-[#252D3A] pb-4">Getting Started</h3>
          <div className="space-y-4">
            
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-[#4F46E5] dark:bg-[#A5B4FC] text-white dark:text-[#0D1117] flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <p className="font-semibold text-[#111827] dark:text-[#F3F5F9] line-through opacity-70">Configure Workspace Profile</p>
                <p className="text-sm text-[#64748B] dark:text-[#9AA6B8]">You successfully set up your workspace basics.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full border-2 border-[#E2E8F0] dark:border-[#252D3A] flex items-center justify-center shrink-0"></div>
              <div>
                <p className="font-semibold text-[#111827] dark:text-[#F3F5F9]">Generate your first Intake Link</p>
                <p className="text-sm text-[#64748B] dark:text-[#9AA6B8] mb-2">Create a white-labeled link to send to a prospective client.</p>
                <button className="text-sm font-semibold text-[#4F46E5] dark:text-[#A5B4FC] hover:underline">Go to Intake Links &rarr;</button>
              </div>
            </div>

          </div>
        </div>

        {/* Workspace Quick Summary */}
        <div className="bg-[#F8FAFC] dark:bg-[#0D1117] rounded-2xl border border-[#E2E8F0] dark:border-[#252D3A] p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9AA6B8] mb-4">Workspace Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#64748B] dark:text-[#9AA6B8] mb-1">Type</p>
              <p className="text-sm font-semibold capitalize">{workspace.workspace_type}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] dark:text-[#9AA6B8] mb-1">Location</p>
              <p className="text-sm font-semibold">{workspace.city}, {workspace.country}</p>
            </div>
            {workspace.services && workspace.services.length > 0 && (
              <div>
                <p className="text-xs text-[#64748B] dark:text-[#9AA6B8] mb-1">Core Services</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {workspace.services.slice(0, 3).map(service => (
                    <span key={service} className="px-2 py-1 text-[10px] font-semibold bg-[#E2E8F0] dark:bg-[#252D3A] rounded-md text-[#111827] dark:text-[#F3F5F9]">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}