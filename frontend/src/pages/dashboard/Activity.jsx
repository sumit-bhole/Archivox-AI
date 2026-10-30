import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext } from 'react-router-dom';
import { Activity as ActivityIcon, Clock, Sparkles } from 'lucide-react';

export default function Activity() {
  const { workspace } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!workspace) return;

      const { data, error } = await supabase
  .from('leads_prds')
  .select('*')
  .eq('agency_id', workspace.id) // ✅ Matches the actual DB column name
  .order('created_at', { ascending: false });

      if (!error && data) {
        setActivities(data);
      }
      setLoading(false);
    };

    fetchActivity();
  }, [workspace]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-[#F3F5F9]">Activity Feed</h1>
        <p className="text-[#64748B] dark:text-[#9AA6B8] mt-1">Chronological log of workspace events and client submissions.</p>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#151B24] rounded-3xl border border-[#E2E8F0] dark:border-[#252D3A] shadow-sm p-8">
        
        {loading ? (
          <div className="text-center py-10 text-[#64748B] dark:text-[#9AA6B8] animate-pulse">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
             <div className="w-12 h-12 bg-[#F8FAFC] dark:bg-[#0D1117] rounded-full flex items-center justify-center mx-auto mb-3 text-[#64748B] dark:text-[#9AA6B8]">
                <ActivityIcon size={24} />
             </div>
             <p className="text-[#64748B] dark:text-[#9AA6B8] font-medium">No activity yet.</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E2E8F0] dark:before:via-[#252D3A] before:to-transparent">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#FFFFFF] dark:border-[#151B24] bg-[#4F46E5]/10 dark:bg-[#A5B4FC]/10 text-[#4F46E5] dark:text-[#A5B4FC] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <Sparkles size={16} />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#252D3A] bg-[#F8FAFC] dark:bg-[#0D1117] shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-[#111827] dark:text-[#F3F5F9] text-sm">New Project Received</h3>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-[#64748B] dark:text-[#9AA6B8]">
                      <Clock size={12}/> 
                      {new Date(activity.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#64748B] dark:text-[#9AA6B8] leading-relaxed">
                    <strong>{activity.client_name}</strong> submitted requirements for: <span className="italic">{activity.project_summary}</span>
                  </p>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}