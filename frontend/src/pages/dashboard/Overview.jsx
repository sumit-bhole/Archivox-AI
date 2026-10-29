import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Users, PhoneCall, FileJson, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview() {
  const [stats, setStats] = useState({ leads: 0, hours: 0 });
  const [loading, setLoading] = useState(true);

  // Example Activity Data (Replace with DB fetch later)
  const chartData = [
    { name: 'Mon', visits: 4 }, { name: 'Tue', visits: 7 }, { name: 'Wed', visits: 2 },
    { name: 'Thu', visits: 10 }, { name: 'Fri', visits: 5 }, { name: 'Sat', visits: 8 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch actual data from your existing leads_prds table
      const { data, error } = await supabase
        .from('leads_prds')
        .select('estimated_hours')
        .eq('agency_id', user.id);

      if (!error && data) {
        const totalHours = data.reduce((acc, curr) => acc + (curr.estimated_hours || 0), 0);
        setStats({ leads: data.length, hours: totalHours });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="p-6 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{loading ? '-' : value}</h3>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Workspace Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor your AI discovery metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads Scoped" value={stats.leads} icon={Users} color="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" />
        <StatCard title="Total Pipeline Hours" value={stats.hours} icon={FileJson} color="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" />
        <StatCard title="Conversations (7d)" value="12" icon={PhoneCall} color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
        <StatCard title="Needs Review" value="2" icon={AlertCircle} color="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" />
      </div>

      <div className="p-6 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Traffic & Discovery Calls</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', color: '#fff', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}