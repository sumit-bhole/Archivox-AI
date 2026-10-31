import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useOutletContext } from 'react-router-dom';
import { 
  Plus, Copy, Edit2, Trash2, ExternalLink, Loader2, X, 
  ChevronRight, Monitor, Smartphone, Check, LayoutTemplate, Palette, Type, Settings, Globe, UserSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_DESIGN = {
  theme: 'dark', backgroundColor: '#0A0A0A', textColor: '#FFFFFF', buttonColor: '#4F46E5', 
  font: 'Inter', buttonStyle: 'rounded', backgroundStyle: 'solid'
};

const DEFAULT_CONTENT = {
  heading: "Let's Bring Your Idea to Life", subtitle: "Tell us about your project. Our AI assistant will help us understand what you want to build.", 
  startBtn: "Start Project Discovery", nameLabel: "Full Name", emailLabel: "Email Address", phoneLabel: "Phone Number", 
  welcomeHeading: "AI Consultant", welcomeMessage: "Hello! I'm your project discovery assistant. I'll ask you a few questions.", 
  completionHeading: "Discovery Complete", completionMessage: "Thank you for sharing your idea. Our team will review your requirements.", 
  privacyNotice: "I consent to this voice session being processed securely."
};

const DEFAULT_UX = { requirePhone: true, requireCompany: true, allowMute: true, allowEndCall: true };

const DEFAULT_AI = {
  assistantName: "AI Consultant", tone: "Professional", agencyContext: "", importantInfo: "", avoidTopics: ""
};

// --- SUB-COMPONENTS FOR BUILDER STEPS (Optimized for zero-scroll fit) ---
const inputClass = "w-full p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg outline-none text-xs text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600";
const labelClass = "block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1";
const sectionClass = "space-y-3 w-full h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-300";

const SetupStep = ({ formData, updateData }) => (
  <div className={sectionClass}>
    <div><label className={labelClass}>Internal Link Name</label><input type="text" value={formData.name || ''} onChange={e => updateData({ name: e.target.value })} className={inputClass} placeholder="Q4 SaaS Campaign" /></div>
    <div><label className={labelClass}>Public URL Slug</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">/intake/</span><input type="text" value={formData.url_slug || ''} onChange={e => updateData({ url_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className={`${inputClass} pl-[60px]`} /></div></div>
    <div className="grid grid-cols-2 gap-3">
      <div><label className={labelClass}>Agency Name</label><input type="text" value={formData.agency_name || ''} onChange={e => updateData({ agency_name: e.target.value })} className={inputClass} /></div>
      <div>
        <label className={labelClass}>Organization Type</label>
        <select value={formData.project_category || ''} onChange={e => updateData({ project_category: e.target.value })} className={inputClass}>
          {['Software Agency', 'Web Development', 'AI Agency', 'Freelancer', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
    <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/30 flex items-center justify-between mt-2">
      <div>
        <p className="text-xs font-semibold text-white">Active Status</p>
        <p className="text-[10px] text-zinc-500">Allow clients to access this link.</p>
      </div>
      <input type="checkbox" checked={formData.is_active || false} onChange={e => updateData({ is_active: e.target.checked })} className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 cursor-pointer" />
    </div>
  </div>
);

const AppearanceStep = ({ formData, updateConfig }) => {
  const d = formData.design_config || {};
  return (
    <div className={sectionClass}>
      <div>
        <label className={labelClass}>Premium Themes</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'dark', name: 'Dark Studio', bg: '#0A0A0A', text: '#FFFFFF', btn: '#4F46E5', style: 'solid' },
            { id: 'gradient', name: 'Midnight Gradient', bg: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)', text: '#EEF2FF', btn: '#818CF8', style: 'gradient' },
            { id: 'minimal', name: 'Minimal Light', bg: '#F8FAFC', text: '#0F172A', btn: '#1E293B', style: 'solid' },
            { id: 'noise', name: 'Textured Grid', bg: '#18181b', text: '#f4f4f5', btn: '#10b981', style: 'grid' }
          ].map(t => (
            <button key={t.id} onClick={() => updateConfig('design_config', { theme: t.id, backgroundColor: t.bg, textColor: t.text, buttonColor: t.btn, backgroundStyle: t.style })} className={`p-3 border rounded-xl flex flex-col items-start gap-2 transition-all ${d.theme === t.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700'}`}>
              <span className="font-semibold text-xs text-white">{t.name}</span>
              <div className="w-full h-8 rounded-lg border border-white/10 flex items-center justify-between px-2" style={{ background: t.bg }}>
                <div className="w-1/2 h-1.5 rounded bg-white/20"></div>
                <div className="w-4 h-4 rounded-full" style={{ background: t.btn }}></div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-800">
        <div>
          <label className={labelClass}>Accent Color</label>
          <div className="flex gap-2">
            <input type="color" value={d.buttonColor || '#4F46E5'} onChange={e => updateConfig('design_config', { buttonColor: e.target.value })} className="h-8 w-10 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
            <input type="text" value={d.buttonColor || '#4F46E5'} onChange={e => updateConfig('design_config', { buttonColor: e.target.value })} className={`${inputClass} uppercase font-mono`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Element Shape</label>
          <select value={d.buttonStyle || 'rounded'} onChange={e => updateConfig('design_config', { buttonStyle: e.target.value })} className={inputClass}>
            <option value="rounded">Rounded</option><option value="pill">Pill</option><option value="square">Square</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const ContentStep = ({ formData, updateConfig }) => {
  const c = formData.content_config || {};
  return (
    <div className={sectionClass}>
      <div><label className={labelClass}>Main Heading</label><input type="text" value={c.heading || ''} onChange={e => updateConfig('content_config', { heading: e.target.value })} className={inputClass} /></div>
      <div><label className={labelClass}>Subtitle</label><textarea rows="2" value={c.subtitle || ''} onChange={e => updateConfig('content_config', { subtitle: e.target.value })} className={`${inputClass} resize-none`} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Start Button Text</label><input type="text" value={c.startBtn || ''} onChange={e => updateConfig('content_config', { startBtn: e.target.value })} className={inputClass} /></div>
        <div><label className={labelClass}>AI Greeting Heading</label><input type="text" value={c.welcomeHeading || ''} onChange={e => updateConfig('content_config', { welcomeHeading: e.target.value })} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>AI Welcome Message</label><textarea rows="2" value={c.welcomeMessage || ''} onChange={e => updateConfig('content_config', { welcomeMessage: e.target.value })} className={`${inputClass} resize-none`} /></div>
      <div><label className={labelClass}>Success Message</label><textarea rows="2" value={c.completionMessage || ''} onChange={e => updateConfig('content_config', { completionMessage: e.target.value })} className={`${inputClass} resize-none`} /></div>
    </div>
  );
};

const ClientExperienceStep = ({ formData, updateConfig }) => {
  const ux = formData.client_ux_config || {};
  return (
    <div className={sectionClass}>
      <label className={labelClass}>Required Contact Fields</label>
      <div className="space-y-2 mb-4">
        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition">
          <input type="checkbox" checked={ux.requirePhone !== false} onChange={e => updateConfig('client_ux_config', { requirePhone: e.target.checked })} className="w-4 h-4 text-indigo-500 rounded border-zinc-700 bg-zinc-900" />
          <span className="text-xs font-medium text-white">Require Phone Number</span>
        </label>
        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition">
          <input type="checkbox" checked={ux.requireCompany !== false} onChange={e => updateConfig('client_ux_config', { requireCompany: e.target.checked })} className="w-4 h-4 text-indigo-500 rounded border-zinc-700 bg-zinc-900" />
          <span className="text-xs font-medium text-white">Require Company Name</span>
        </label>
      </div>
      <label className={labelClass}>Voice Call Controls</label>
      <div className="space-y-2">
        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition">
          <input type="checkbox" checked={ux.allowMute !== false} onChange={e => updateConfig('client_ux_config', { allowMute: e.target.checked })} className="w-4 h-4 text-indigo-500 rounded border-zinc-700 bg-zinc-900" />
          <span className="text-xs font-medium text-white">Allow client to Mute/Unmute</span>
        </label>
        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition">
          <input type="checkbox" checked={ux.allowEndCall !== false} onChange={e => updateConfig('client_ux_config', { allowEndCall: e.target.checked })} className="w-4 h-4 text-indigo-500 rounded border-zinc-700 bg-zinc-900" />
          <span className="text-xs font-medium text-white">Allow client to End Call early</span>
        </label>
      </div>
    </div>
  );
};

const AIBrainStep = ({ formData, updateConfig }) => {
  const ai = formData.ai_config || {};
  return (
    <div className={sectionClass}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Consultant Name</label><input type="text" value={ai.assistantName || ''} onChange={e => updateConfig('ai_config', { assistantName: e.target.value })} className={inputClass} /></div>
        <div>
          <label className={labelClass}>Tone</label>
          <select value={ai.tone || 'Professional'} onChange={e => updateConfig('ai_config', { tone: e.target.value })} className={inputClass}>
            <option value="Professional">Professional</option><option value="Friendly">Friendly</option><option value="Technical">Technical</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Agency Context & Capabilities</label>
        <textarea rows="2" placeholder="We are a React & Python shop building SaaS products..." value={ai.agencyContext || ''} onChange={e => updateConfig('ai_config', { agencyContext: e.target.value })} className={`${inputClass} resize-none`} />
      </div>
      <div>
        <label className={labelClass}>Critical Info to Collect</label>
        <textarea rows="2" placeholder="Budget, timeline, integrations..." value={ai.importantInfo || ''} onChange={e => updateConfig('ai_config', { importantInfo: e.target.value })} className={`${inputClass} resize-none`} />
      </div>
      <div>
        <label className={labelClass}>Topics to Avoid</label>
        <textarea rows="2" placeholder="Never discuss pricing or promise exact deadlines." value={ai.avoidTopics || ''} onChange={e => updateConfig('ai_config', { avoidTopics: e.target.value })} className={`${inputClass} resize-none`} />
      </div>
    </div>
  );
};

function LivePreview({ formData, mode }) {
  const [phase, setPhase] = useState('welcome');
  const d = formData.design_config || {};
  const c = formData.content_config || {};
  const ai = formData.ai_config || {};
  const ux = formData.client_ux_config || {};

  const borderRadius = d.buttonStyle === 'pill' ? '999px' : d.buttonStyle === 'rounded' ? '12px' : '0px';
  const bgStyle = d.backgroundStyle === 'gradient' ? { background: d.backgroundColor } 
                : d.backgroundStyle === 'grid' ? { backgroundColor: d.backgroundColor, backgroundImage: 'linear-gradient(#ffffff0a 1px, transparent 1px), linear-gradient(90deg, #ffffff0a 1px, transparent 1px)', backgroundSize: '20px 20px' }
                : { backgroundColor: d.backgroundColor };

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className={`transition-all duration-500 shadow-2xl overflow-hidden relative flex flex-col ${mode === 'mobile' ? 'w-[320px] h-[700px] rounded-[2.5rem] border-8 border-zinc-900' : 'w-full h-full rounded-xl border border-zinc-800'}`} style={{ ...bgStyle, color: d.textColor, fontFamily: d.font }}>
        
        <div className="absolute top-5 left-5 text-[10px] font-bold tracking-tight flex items-center gap-1.5 z-10">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.buttonColor }}></div> 
          {formData.agency_name || "Agency Name"}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col items-center justify-center p-6">
          <AnimatePresence mode="wait">
            
            {phase === 'welcome' && (
              <motion.div key="welcome" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-3 tracking-tight leading-tight">{c.heading}</h1>
                <p className="opacity-80 mb-8 text-xs leading-relaxed">{c.subtitle}</p>
                <button onClick={() => setPhase('form')} className="w-full py-3 font-bold shadow-lg text-xs transition-transform hover:scale-[1.02]" style={{ backgroundColor: d.buttonColor, color: '#fff', borderRadius }}>
                  {c.startBtn}
                </button>
              </motion.div>
            )}

            {phase === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-sm">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <h2 className="text-lg font-bold mb-3 tracking-tight">Your Details</h2>
                  <div className="space-y-2.5">
                    <input type="text" placeholder={c.nameLabel} className="w-full p-2.5 bg-black/20 border border-white/10 rounded-lg text-xs outline-none" readOnly />
                    <input type="email" placeholder={c.emailLabel} className="w-full p-2.5 bg-black/20 border border-white/10 rounded-lg text-xs outline-none" readOnly />
                    {ux.requirePhone !== false && <input type="tel" placeholder={c.phoneLabel} className="w-full p-2.5 bg-black/20 border border-white/10 rounded-lg text-xs outline-none" readOnly />}
                    {ux.requireCompany !== false && <input type="text" placeholder="Company Name" className="w-full p-2.5 bg-black/20 border border-white/10 rounded-lg text-xs outline-none" readOnly />}
                    <textarea rows="2" placeholder="Briefly, what are you trying to build?" className="w-full p-2.5 bg-black/20 border border-white/10 rounded-lg text-xs outline-none resize-none" readOnly></textarea>
                    <button onClick={() => setPhase('call')} className="w-full py-3 font-bold mt-1 shadow-lg text-xs transition-transform hover:scale-[1.02]" style={{ backgroundColor: d.buttonColor, color: '#fff', borderRadius }}>
                      Connect Microphone
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- MAIN EXPORT ---
export default function IntakeLinks() {
  const { workspace } = useOutletContext();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState('list');
  const [step, setStep] = useState(1);
  const [previewMode, setPreviewMode] = useState('desktop'); 
  const [formData, setFormData] = useState({});

  useEffect(() => { fetchLinks(); }, [workspace]);

  const fetchLinks = async () => {
    if (!workspace) return;
    const { data } = await supabase.from('intake_links').select('*').eq('workspace_id', workspace.id).order('created_at', { ascending: false });
    if (data) setLinks(data);
    setLoading(false);
  };

  const openBuilder = (link = null) => {
    setFormData(link || {
      id: null, name: 'New Campaign', agency_name: workspace.name, project_category: 'Software Agency', url_slug: `discovery-${Math.floor(Math.random()*10000)}`,
      design_config: { ...DEFAULT_DESIGN }, content_config: { ...DEFAULT_CONTENT }, client_ux_config: { ...DEFAULT_UX }, ai_config: { ...DEFAULT_AI }, status: 'draft', is_active: true
    });
    setStep(1);
    setView('builder');
  };

  const updateData = (updates) => setFormData(prev => ({ ...prev, ...updates }));
  const updateConfig = (configKey, updates) => setFormData(prev => ({
    ...prev, [configKey]: { ...prev[configKey], ...updates }
  }));

  const handleSave = async (publish = false) => {
    const payload = {
      ...formData, workspace_id: workspace.id,
      status: publish ? 'published' : 'draft', is_active: publish ? true : formData.is_active
    };
    
    try {
      if (formData.id) await supabase.from('intake_links').update(payload).eq('id', formData.id);
      else await supabase.from('intake_links').insert([payload]);
      
      await fetchLinks();
      if (publish) setView('list');
    } catch (err) {
      alert("Failed to save: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    await supabase.from('intake_links').delete().eq('id', id);
    fetchLinks();
  };

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/intake/${slug}`);
    alert('Public URL copied!');
  };

  if (view === 'builder') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row h-screen font-sans text-white">
        
        {/* Left Panel: Builder Controls - Locked to exact height, no scrolling */}
        <div className="w-full md:w-[450px] lg:w-[500px] flex flex-col h-full border-r border-zinc-900 bg-[#0A0A0A] shadow-2xl z-20 overflow-hidden">
          
          {/* Header Action Bar */}
          <div className="h-14 px-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/30 shrink-0">
            <button onClick={() => setView('list')} className="text-zinc-400 hover:text-white flex items-center gap-1.5 text-xs font-medium transition-colors"><X size={16}/> Cancel</button>
            {step === 6 && (
              <button onClick={() => handleSave(true)} className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 transition-colors">Publish</button>
            )}
          </div>
          
          {/* Squeezed Horizontal Navigation Tabs */}
          <div className="px-4 border-b border-zinc-900 flex justify-between items-center w-full bg-[#0A0A0A] shrink-0">
            {[
              { id: 1, name: 'Setup', icon: Settings }, { id: 2, name: 'Design', icon: Palette },
              { id: 3, name: 'Content', icon: Type }, { id: 4, name: 'UX', icon: UserSquare },
              { id: 5, name: 'AI Brain', icon: Globe }, { id: 6, name: 'Launch', icon: Check }
            ].map((s) => (
              <button key={s.id} onClick={() => setStep(s.id)} className={`text-[10px] md:text-xs font-medium py-3 flex flex-col md:flex-row items-center gap-1 transition-colors border-b-2 ${step === s.id ? 'text-indigo-400 border-indigo-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                <s.icon size={14}/> <span className="hidden md:inline">{s.name}</span>
              </button>
            ))}
          </div>

          {/* Builder Content Area - No scroll, auto-centering flex */}
          <div className="flex-1 overflow-hidden p-4 md:p-6 bg-[#0A0A0A] flex flex-col justify-center">
            {step === 1 && <SetupStep formData={formData} updateData={updateData} />}
            {step === 2 && <AppearanceStep formData={formData} updateConfig={updateConfig} />}
            {step === 3 && <ContentStep formData={formData} updateConfig={updateConfig} />}
            {step === 4 && <ClientExperienceStep formData={formData} updateConfig={updateConfig} />}
            {step === 5 && <AIBrainStep formData={formData} updateConfig={updateConfig} />}
            {step === 6 && (
              <div className="text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-emerald-900/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} /></div>
                <h2 className="text-2xl font-bold mb-2 text-white">Ready to Launch</h2>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">Your public portal is ready. <br/>It will be live at: <br/><strong className="text-white block mt-2 p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">{window.location.origin}/intake/{formData.url_slug}</strong></p>
                <button onClick={() => handleSave(true)} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors text-sm">Deploy Portal</button>
              </div>
            )}
          </div>
          
          {/* Bottom Footer Navigation */}
          {step < 6 && (
            <div className="p-4 border-t border-zinc-900 bg-zinc-900/20 flex justify-between shrink-0">
              <button onClick={() => setStep(step - 1)} disabled={step === 1} className="px-5 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-xs font-medium disabled:opacity-50 transition-colors">Back</button>
              <button onClick={() => setStep(step + 1)} className="px-5 py-2 bg-white text-black rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-zinc-200 transition-colors">Continue <ChevronRight size={16}/></button>
            </div>
          )}
        </div>

        {/* Right Panel: Live Preview Frame */}
        <div className="flex-1 h-full flex flex-col relative hidden md:flex bg-black">
          <div className="absolute top-4 right-4 z-30 flex bg-zinc-900 rounded-xl border border-zinc-800 p-1 gap-1 shadow-2xl">
            <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-lg transition-colors ${previewMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}><Monitor size={16}/></button>
            <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-lg transition-colors ${previewMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}><Smartphone size={16}/></button>
          </div>
          <LivePreview formData={formData} mode={previewMode} />
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Portals</h1>
          <p className="text-zinc-400 text-sm mt-1">Design and manage public URLs for client discovery.</p>
        </div>
        <button onClick={() => openBuilder()} className="bg-white text-black px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg">
          <Plus size={18} /> Create Portal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <Loader2 className="animate-spin text-zinc-500" /> : links.map(link => (
          <div key={link.id} className="bg-[#0A0A0A] border border-zinc-900 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg text-white leading-tight mb-1">{link.name}</h3>
                <p className="text-xs font-medium text-zinc-500">{link.project_category}</p>
              </div>
              <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${link.status === 'published' ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-800/50' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}>
                {link.status}
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-zinc-300 mb-8 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 mt-auto">
              <span className="truncate flex-1 font-mono text-xs">/intake/{link.url_slug}</span>
              <button onClick={() => copyLink(link.url_slug)} className="p-1.5 text-zinc-400 hover:text-white bg-black rounded-md border border-zinc-800 shadow-sm"><Copy size={14}/></button>
            </div>

            <div className="flex justify-between items-center border-t border-zinc-900 pt-5">
              <div className="flex gap-1.5">
                <button onClick={() => openBuilder(link)} className="p-2 text-zinc-500 hover:bg-zinc-900 rounded-lg hover:text-white transition-colors"><Edit2 size={16}/></button>
                <button onClick={() => handleDelete(link.id)} className="p-2 text-zinc-500 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={16}/></button>
              </div>
              <a href={`/intake/${link.url_slug}`} target="_blank" rel="noreferrer" className="text-sm font-semibold flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors">
                Preview <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && links.length === 0 && (
        <div className="text-center py-20 bg-[#0A0A0A] border border-zinc-900 rounded-3xl">
          <LayoutTemplate size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Portals Yet</h3>
          <p className="text-zinc-500 mb-6">Create your first public discovery link to start capturing leads.</p>
          <button onClick={() => openBuilder()} className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm">Create Intake Link</button>
        </div>
      )}
    </div>
  );
}