import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext } from 'react-router-dom';
import { Loader2, User, Building2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const { workspace } = useOutletContext();
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace' or 'profile'
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [wsData, setWsData] = useState({
    name: workspace?.name || '',
    website: workspace?.website || '',
    city: workspace?.city || '',
    country: workspace?.country || '',
    description: workspace?.description || ''
  });

  const [profData, setProfData] = useState({
    full_name: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfile({ ...data, email: user.email });
          setProfData({ full_name: data.full_name || '' });
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSaveWorkspace = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('workspaces').update(wsData).eq('id', workspace.id);
      if (error) throw error;
      alert("Workspace updated successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update(profData).eq('id', profile.id);
      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Tabs */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-6">Settings</h1>
        
        <div className="flex space-x-1 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'workspace' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
          >
            <Building2 size={16} /> Workspace Details
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'profile' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
          >
            <User size={16} /> Personal Profile
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          
          {/* WORKSPACE TAB */}
          {activeTab === 'workspace' && (
            <motion.div key="workspace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <form onSubmit={handleSaveWorkspace} className="bg-white dark:bg-[#0A0A0A] p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-900 shadow-sm space-y-6">
                
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Business Identity</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Manage your agency or freelancer public details.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Workspace Name</label>
                    <input type="text" value={wsData.name} onChange={e => setWsData({...wsData, name: e.target.value})} className="w-full p-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Website</label>
                    <input type="url" value={wsData.website} onChange={e => setWsData({...wsData, website: e.target.value})} className="w-full p-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">City</label>
                      <input type="text" value={wsData.city} onChange={e => setWsData({...wsData, city: e.target.value})} className="w-full p-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Country</label>
                      <input type="text" value={wsData.country} onChange={e => setWsData({...wsData, country: e.target.value})} className="w-full p-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors text-sm" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                  <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-black font-medium text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#0A0A0A] p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-900 shadow-sm space-y-6">
                
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Personal Account</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Manage your personal login identity and contact information.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Full Name</label>
                    <input type="text" value={profData.full_name} onChange={e => setProfData({...profData, full_name: e.target.value})} className="w-full p-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">Email <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">Read Only</span></label>
                    <input type="email" value={profile?.email || 'Loading...'} disabled className="w-full p-2.5 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 cursor-not-allowed text-sm" />
                    <p className="text-xs text-zinc-500 mt-2">Your email address is managed via your secure authentication provider.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                  <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-black font-medium text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Update Profile</>}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}