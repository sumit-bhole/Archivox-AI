import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext } from 'react-router-dom';
import { 
  Plus, Copy, Edit2, Trash2, ExternalLink, Loader2, Save, X, 
  ChevronRight, Monitor, Smartphone, Check, LayoutTemplate, Palette, Type, Settings, Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_DESIGN = {
  theme: 'dark', primaryColor: '#4F46E5', secondaryColor: '#818CF8', 
  backgroundColor: '#0A0A0A', textColor: '#FFFFFF', buttonColor: '#4F46E5', 
  font: 'Inter', buttonStyle: 'rounded', layout: 'centered', backgroundStyle: 'solid'
};

const DEFAULT_CONTENT = {
  heading: "Let's Bring Your Idea to Life",
  subtitle: "Tell us about your project. Our AI assistant will help us understand what you want to build.",
  agencyDesc: "", startBtn: "Start Project Discovery", nameLabel: "Full Name", 
  emailLabel: "Email Address", phoneLabel: "Phone Number", 
  welcomeHeading: "AI Consultant",
  welcomeMessage: "Hello! I'm your project discovery assistant. I'll ask you a few questions to understand your idea and requirements.",
  micInstruction: "Please allow microphone access to speak with the AI.",
  completionHeading: "Discovery Complete",
  completionMessage: "Thank you for sharing your idea. Our team will review your requirements and get back to you.",
  privacyNotice: "I consent to this voice session being processed securely.",
  supportText: "Need help? Contact us."
};

const DEFAULT_AI = {
  assistantName: "AI Consultant", tone: "Professional", language: "en",
  agencyContext: "", discoveryDepth: "basic", customQuestions: "", 
  importantInfo: "", optionalTopics: "", customInstructions: ""
};

export default function IntakeLinks() {
  const { workspace } = useOutletContext();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState('list');
  const [step, setStep] = useState(1);
  const [previewMode, setPreviewMode] = useState('desktop'); 
  
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchLinks(); }, [workspace]);

  const fetchLinks = async () => {
    if (!workspace) return;
    const { data } = await supabase.from('intake_links').select('*').eq('workspace_id', workspace.id).order('created_at', { ascending: false });
    if (data) setLinks(data);
    setLoading(false);
  };

  const openBuilder = (link = null) => {
    if (link) {
      setFormData(link);
    } else {
      setFormData({
        id: null, name: 'New Campaign', agency_name: workspace.name, project_category: 'Website Development',
        url_slug: `discovery-${Math.floor(Math.random()*10000)}`, contact_email: '', website: '',
        design_config: { ...DEFAULT_DESIGN }, content_config: { ...DEFAULT_CONTENT }, ai_config: { ...DEFAULT_AI },
        status: 'draft', is_active: true
      });
    }
    setStep(1);
    setView('builder');
  };

  const handleSave = async (publish = false) => {
    setIsSaving(true);
    const payload = {
      name: formData.name,
      url_slug: formData.url_slug,
      agency_name: formData.agency_name,
      project_category: formData.project_category,
      contact_email: formData.contact_email,
      website: formData.website,
      design_config: formData.design_config,
      content_config: formData.content_config,
      ai_config: formData.ai_config,
      workspace_id: workspace.id,
      status: publish ? 'published' : 'draft',
      is_active: publish ? true : formData.is_active
    };
    
    try {
      if (formData.id) {
        const { error } = await supabase.from('intake_links').update(payload).eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('intake_links').insert([payload]);
        if (error) throw error;
      }
      await fetchLinks();
      if (publish) setView('list');
    } catch (err) {
      console.error(err);
      alert("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this link?')) return;
    await supabase.from('intake_links').delete().eq('id', id);
    fetchLinks();
  };

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/intake/${slug}`);
    alert('Public URL copied!');
  };

  const inputClass = "w-full p-3 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm text-zinc-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600";
  const labelClass = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2";

  // --- INLINE RENDER FUNCTIONS TO PREVENT FOCUS LOSS ---
  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in">
      <div><label className={labelClass}>Internal Link Name</label><input type="text" value={formData.name || ''} onChange={e=>setFormData({...formData, name: e.target.value})} className={inputClass} /></div>
      <div><label className={labelClass}>Public URL Slug</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">/intake/</span><input type="text" value={formData.url_slug || ''} onChange={e=>setFormData({...formData, url_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})} className={`${inputClass} pl-[70px]`} /></div></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Agency Name</label><input type="text" value={formData.agency_name || ''} onChange={e=>setFormData({...formData, agency_name: e.target.value})} className={inputClass} /></div>
        <div>
          <label className={labelClass}>Project Category</label>
          <select value={formData.project_category || ''} onChange={e=>setFormData({...formData, project_category: e.target.value})} className={inputClass}>
            {['Website Development', 'Web Application', 'Mobile Application', 'AI/ML Development', 'E-commerce', 'Custom Software', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <input type="checkbox" id="activeToggle" checked={formData.is_active || false} onChange={e=>setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 bg-transparent text-indigo-600" />
        <label htmlFor="activeToggle" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">Link is publicly active and accepting calls</label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <label className={labelClass}>Ready-Made Themes</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'minimal', name: 'Minimal Light', bg: '#FFFFFF', text: '#09090B', btn: '#09090B', border: 'border-zinc-200' },
            { id: 'dark', name: 'Dark Studio', bg: '#0A0A0A', text: '#FFFFFF', btn: '#4F46E5', border: 'border-zinc-800' },
            { id: 'creative', name: 'Creative Gradient', bg: '#1E1B4B', text: '#EEF2FF', btn: '#818CF8', border: 'border-indigo-900' },
            { id: 'corporate', name: 'Corporate Navy', bg: '#F8FAFC', text: '#0F172A', btn: '#1E293B', border: 'border-slate-300' }
          ].map(t => (
            <button key={t.id} onClick={() => setFormData({...formData, design_config: {...formData.design_config, theme: t.id, backgroundColor: t.bg, textColor: t.text, buttonColor: t.btn}})} className={`p-4 border rounded-xl flex flex-col items-start gap-3 transition-all ${formData.design_config?.theme === t.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-500' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'}`}>
              <span className="font-semibold text-sm text-zinc-900 dark:text-white">{t.name}</span>
              <div className={`w-full h-12 rounded-lg border ${t.border} flex items-center justify-between px-3`} style={{background: t.bg}}>
                <div className="w-1/2 h-2 rounded bg-opacity-20" style={{background: t.text}}></div>
                <div className="w-6 h-6 rounded-full" style={{background: t.btn}}></div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <div><label className={labelClass}>Custom Button Color</label>
          <div className="flex gap-2">
            <input type="color" value={formData.design_config?.buttonColor || '#000000'} onChange={e=>setFormData({...formData, design_config: {...formData.design_config, buttonColor: e.target.value}})} className="h-11 w-14 rounded-xl cursor-pointer bg-transparent border-0 p-0" />
            <input type="text" value={formData.design_config?.buttonColor || '#000000'} onChange={e=>setFormData({...formData, design_config: {...formData.design_config, buttonColor: e.target.value}})} className={`${inputClass} uppercase font-mono`} />
          </div>
        </div>
        <div><label className={labelClass}>Button Shape</label><select value={formData.design_config?.buttonStyle || 'rounded'} onChange={e=>setFormData({...formData, design_config: {...formData.design_config, buttonStyle: e.target.value}})} className={inputClass}><option value="rounded">Rounded</option><option value="pill">Pill</option><option value="square">Square</option></select></div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in">
      <div><label className={labelClass}>Main Heading</label><input type="text" value={formData.content_config?.heading || ''} onChange={e=>setFormData({...formData, content_config: {...formData.content_config, heading: e.target.value}})} className={inputClass} /></div>
      <div><label className={labelClass}>Subtitle</label><textarea rows="3" value={formData.content_config?.subtitle || ''} onChange={e=>setFormData({...formData, content_config: {...formData.content_config, subtitle: e.target.value}})} className={`${inputClass} resize-none`} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Start Button Text</label><input type="text" value={formData.content_config?.startBtn || ''} onChange={e=>setFormData({...formData, content_config: {...formData.content_config, startBtn: e.target.value}})} className={inputClass} /></div>
        <div><label className={labelClass}>AI Greeting Heading</label><input type="text" value={formData.content_config?.welcomeHeading || ''} onChange={e=>setFormData({...formData, content_config: {...formData.content_config, welcomeHeading: e.target.value}})} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>AI Welcome Message (Voice Screen)</label><textarea rows="3" value={formData.content_config?.welcomeMessage || ''} onChange={e=>setFormData({...formData, content_config: {...formData.content_config, welcomeMessage: e.target.value}})} className={`${inputClass} resize-none`} /></div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>AI Consultant Name</label><input type="text" value={formData.ai_config?.assistantName || ''} onChange={e=>setFormData({...formData, ai_config: {...formData.ai_config, assistantName: e.target.value}})} className={inputClass} /></div>
        <div>
          <label className={labelClass}>Conversation Tone</label>
          <select value={formData.ai_config?.tone || 'Professional'} onChange={e=>setFormData({...formData, ai_config: {...formData.ai_config, tone: e.target.value}})} className={inputClass}>
            <option value="Professional">Professional & Direct</option><option value="Friendly">Friendly & Welcoming</option><option value="Conversational">Casual & Conversational</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Agency Context & Capabilities</label>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">Provide context so the AI knows what your agency actually does (e.g., "We build Next.js apps", "We do not do SEO").</p>
        <textarea rows="4" placeholder="We specialize in React, Python, and AI automation..." value={formData.ai_config?.agencyContext || ''} onChange={e=>setFormData({...formData, ai_config: {...formData.ai_config, agencyContext: e.target.value}})} className={`${inputClass} resize-none`} />
      </div>
      <div>
        <label className={labelClass}>Critical Information to Collect</label>
        <textarea rows="3" placeholder="Must ask about budget, timeline, and current software stack..." value={formData.ai_config?.importantInfo || ''} onChange={e=>setFormData({...formData, ai_config: {...formData.ai_config, importantInfo: e.target.value}})} className={`${inputClass} resize-none`} />
      </div>
    </div>
  );

  // --- RENDER ---
  if (view === 'builder') {
    const d = formData.design_config || DEFAULT_DESIGN;
    const c = formData.content_config || DEFAULT_CONTENT;
    const borderRadius = d.buttonStyle === 'pill' ? '999px' : d.buttonStyle === 'rounded' ? '12px' : '0px';

    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-[#000000] flex flex-col md:flex-row h-screen font-sans">
        
        {/* Left Panel: Builder Controls */}
        <div className="w-full md:w-[500px] lg:w-[600px] flex flex-col h-full border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] shadow-2xl z-20">
          
          <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <button onClick={() => setView('list')} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"><X size={18}/> Cancel</button>
            <div className="flex gap-3">
              <button onClick={() => handleSave(false)} className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                {isSaving ? <Loader2 size={16} className="animate-spin"/> : 'Save Draft'}
              </button>
              {step === 5 && (
                <button onClick={() => handleSave(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                  Publish Portal
                </button>
              )}
            </div>
          </div>
          
          <div className="px-6 border-b border-zinc-200 dark:border-zinc-800 flex gap-6 overflow-x-auto bg-white dark:bg-[#0A0A0A] no-scrollbar">
            {[
              { id: 1, name: 'Setup', icon: Settings },
              { id: 2, name: 'Design', icon: Palette },
              { id: 3, name: 'Content', icon: Type },
              { id: 4, name: 'AI Brain', icon: Globe },
              { id: 5, name: 'Publish', icon: Check }
            ].map((s) => (
              <button key={s.id} onClick={() => setStep(s.id)} className={`text-sm font-medium whitespace-nowrap py-4 border-b-2 flex items-center gap-2 transition-colors ${step === s.id ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
                <s.icon size={16}/> {s.name}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-[#0A0A0A]">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && (
              <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">Ready to Launch</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">Your public discovery portal is configured. <br/>It will be live at: <br/><strong className="text-zinc-900 dark:text-white block mt-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">{window.location.origin}/intake/{formData.url_slug}</strong></p>
                <button onClick={() => handleSave(true)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 text-lg">Deploy Portal</button>
              </div>
            )}
          </div>
          
          {step < 5 && (
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex justify-between">
              <button onClick={() => setStep(step - 1)} disabled={step === 1} className="px-6 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">Back</button>
              <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">Continue <ChevronRight size={18}/></button>
            </div>
          )}
        </div>

        {/* Right Panel: Live Preview */}
        <div className="flex-1 h-full flex flex-col relative hidden md:flex">
          <div className="absolute top-6 right-6 z-30 flex bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-1.5 gap-1">
            <button onClick={() => setPreviewMode('desktop')} className={`p-2.5 rounded-lg transition-colors ${previewMode === 'desktop' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}><Monitor size={18}/></button>
            <button onClick={() => setPreviewMode('mobile')} className={`p-2.5 rounded-lg transition-colors ${previewMode === 'mobile' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}><Smartphone size={18}/></button>
          </div>
          
          <div className="h-full w-full bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-8 relative overflow-hidden">
            <div className={`transition-all duration-500 shadow-2xl overflow-hidden relative flex flex-col ${previewMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[3rem] border-[10px] border-zinc-800 dark:border-black' : 'w-full h-full rounded-2xl border border-zinc-200 dark:border-zinc-800'}`} style={{ backgroundColor: d.backgroundColor, color: d.textColor, fontFamily: d.font }}>
              
              <div className="absolute top-6 left-6 text-xs font-bold tracking-tight flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.buttonColor }}></div> 
                {formData.agency_name || workspace.name}
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <h1 className="text-3xl font-bold mb-4 tracking-tight leading-tight">{c.heading}</h1>
                <p className="opacity-80 mb-10 text-sm leading-relaxed">{c.subtitle}</p>
                <div className="w-full max-w-xs space-y-4">
                  <div className="h-12 w-full border opacity-20 rounded-xl"></div>
                  <div className="h-12 w-full border opacity-20 rounded-xl"></div>
                  <div className="h-24 w-full border opacity-20 rounded-xl"></div>
                  <button className="w-full py-4 font-bold mt-4 shadow-lg text-sm" style={{ backgroundColor: d.buttonColor, color: '#fff', borderRadius }}>
                    {c.startBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Intake Portals</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Design and manage public URLs for client discovery.</p>
        </div>
        <button onClick={() => openBuilder()} className="bg-zinc-900 text-white dark:bg-white dark:text-black px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
          <Plus size={18} /> Create Portal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <Loader2 className="animate-spin text-zinc-500" /> : links.map(link => (
          <div key={link.id} className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white leading-tight mb-1">{link.name}</h3>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{link.project_category}</p>
              </div>
              <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${link.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' : 'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'}`}>
                {link.status}
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 mb-8 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 mt-auto">
              <span className="truncate flex-1 font-mono text-xs">/intake/{link.url_slug}</span>
              <button onClick={() => copyLink(link.url_slug)} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white dark:bg-black rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm"><Copy size={14}/></button>
            </div>

            <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-5">
              <div className="flex gap-1.5">
                <button onClick={() => openBuilder(link)} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg hover:text-zinc-900 dark:hover:text-white transition-colors"><Edit2 size={16}/></button>
                <button onClick={() => handleDelete(link.id)} className="p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors"><Trash2 size={16}/></button>
              </div>
              <a href={`/intake/${link.url_slug}`} target="_blank" rel="noreferrer" className="text-sm font-semibold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                Preview <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && links.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <LayoutTemplate size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Portals Yet</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">Create your first public discovery link to start capturing leads.</p>
          <button onClick={() => openBuilder()} className="bg-zinc-900 text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-bold text-sm">Create Intake Link</button>
        </div>
      )}
    </div>
  );
}