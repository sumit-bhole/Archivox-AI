import { Palette, CheckCircle2 } from 'lucide-react';

const inputClass = "w-full p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600";
const labelClass = "block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2";
const sectionClass = "space-y-8 animate-in fade-in slide-in-from-right-4 duration-300";

export const SetupStep = ({ formData, updateData }) => (
  <div className={sectionClass}>
    <div><label className={labelClass}>Internal Link Name</label><input type="text" value={formData.name || ''} onChange={e => updateData({ name: e.target.value })} className={inputClass} placeholder="Q4 SaaS Campaign" /></div>
    <div><label className={labelClass}>Public URL Slug</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">/intake/</span><input type="text" value={formData.url_slug || ''} onChange={e => updateData({ url_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className={`${inputClass} pl-[70px]`} /></div></div>
    <div className="grid grid-cols-2 gap-4">
      <div><label className={labelClass}>Agency Name</label><input type="text" value={formData.agency_name || ''} onChange={e => updateData({ agency_name: e.target.value })} className={inputClass} /></div>
      <div>
        <label className={labelClass}>Organization Type</label>
        <select value={formData.project_category || ''} onChange={e => updateData({ project_category: e.target.value })} className={inputClass}>
          {['Software Agency', 'Web Development', 'AI Agency', 'Freelancer', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-white">Active Status</p>
        <p className="text-xs text-zinc-500">Allow clients to access this link.</p>
      </div>
      <input type="checkbox" checked={formData.is_active || false} onChange={e => updateData({ is_active: e.target.checked })} className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500 cursor-pointer" />
    </div>
  </div>
);

export const AppearanceStep = ({ formData, updateConfig }) => {
  const d = formData.design_config || {};
  return (
    <div className={sectionClass}>
      <div>
        <label className={labelClass}>Premium Themes</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'dark', name: 'Dark Studio', bg: '#0A0A0A', text: '#FFFFFF', btn: '#4F46E5', style: 'solid' },
            { id: 'gradient', name: 'Midnight Gradient', bg: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)', text: '#EEF2FF', btn: '#818CF8', style: 'gradient' },
            { id: 'minimal', name: 'Minimal Light', bg: '#F8FAFC', text: '#0F172A', btn: '#1E293B', style: 'solid' },
            { id: 'noise', name: 'Textured Grid', bg: '#18181b', text: '#f4f4f5', btn: '#10b981', style: 'grid' }
          ].map(t => (
            <button key={t.id} onClick={() => updateConfig('design_config', { theme: t.id, backgroundColor: t.bg, textColor: t.text, buttonColor: t.btn, backgroundStyle: t.style })} className={`p-4 border rounded-xl flex flex-col items-start gap-3 transition-all ${d.theme === t.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700'}`}>
              <span className="font-semibold text-sm text-white">{t.name}</span>
              <div className="w-full h-12 rounded-lg border border-white/10 flex items-center justify-between px-3" style={{ background: t.bg }}>
                <div className="w-1/2 h-2 rounded bg-white/20"></div>
                <div className="w-6 h-6 rounded-full" style={{ background: t.btn }}></div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
        <div>
          <label className={labelClass}>Accent & Button Color</label>
          <div className="flex gap-2">
            <input type="color" value={d.buttonColor || '#4F46E5'} onChange={e => updateConfig('design_config', { buttonColor: e.target.value })} className="h-11 w-14 rounded-xl cursor-pointer bg-transparent border-0 p-0" />
            <input type="text" value={d.buttonColor || '#4F46E5'} onChange={e => updateConfig('design_config', { buttonColor: e.target.value })} className={`${inputClass} uppercase font-mono`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Element Shape</label>
          <select value={d.buttonStyle || 'rounded'} onChange={e => updateConfig('design_config', { buttonStyle: e.target.value })} className={inputClass}>
            <option value="rounded">Rounded</option><option value="pill">Pill</option><option value="square">Square (Sharp)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export const ContentStep = ({ formData, updateConfig }) => {
  const c = formData.content_config || {};
  return (
    <div className={sectionClass}>
      <div><label className={labelClass}>Main Heading</label><input type="text" value={c.heading || ''} onChange={e => updateConfig('content_config', { heading: e.target.value })} className={inputClass} /></div>
      <div><label className={labelClass}>Subtitle</label><textarea rows="3" value={c.subtitle || ''} onChange={e => updateConfig('content_config', { subtitle: e.target.value })} className={`${inputClass} resize-none`} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Start Button Text</label><input type="text" value={c.startBtn || ''} onChange={e => updateConfig('content_config', { startBtn: e.target.value })} className={inputClass} /></div>
        <div><label className={labelClass}>AI Greeting Heading</label><input type="text" value={c.welcomeHeading || ''} onChange={e => updateConfig('content_config', { welcomeHeading: e.target.value })} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>AI Welcome Message</label><textarea rows="2" value={c.welcomeMessage || ''} onChange={e => updateConfig('content_config', { welcomeMessage: e.target.value })} className={`${inputClass} resize-none`} /></div>
      <div><label className={labelClass}>Success Message</label><textarea rows="2" value={c.completionMessage || ''} onChange={e => updateConfig('content_config', { completionMessage: e.target.value })} className={`${inputClass} resize-none`} /></div>
    </div>
  );
};

export const ClientExperienceStep = ({ formData, updateConfig }) => {
  const ux = formData.client_ux_config || {};
  return (
    <div className={sectionClass}>
      <label className={labelClass}>Required Contact Fields</label>
      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition">
          <input type="checkbox" checked={ux.requirePhone !== false} onChange={e => updateConfig('client_ux_config', { requirePhone: e.target.checked })} className="w-4 h-4 text-indigo-500 rounded border-zinc-700 bg-zinc-900" />
          <span className="text-sm font-medium text-white">Require Phone Number</span>
        </label>
        <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition">
          <input type="checkbox" checked={ux.requireCompany !== false} onChange={e => updateConfig('client_ux_config', { requireCompany: e.target.checked })} className="w-4 h-4 text-indigo-500 rounded border-zinc-700 bg-zinc-900" />
          <span className="text-sm font-medium text-white">Require Company Name</span>
        </label>
      </div>

      <label className={labelClass}>Voice Call Controls</label>
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition">
          <input type="checkbox" checked={ux.allowMute !== false} onChange={e => updateConfig('client_ux_config', { allowMute: e.target.checked })} className="w-4 h-4 text-indigo-500 rounded border-zinc-700 bg-zinc-900" />
          <span className="text-sm font-medium text-white">Allow client to Mute/Unmute</span>
        </label>
        <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition">
          <input type="checkbox" checked={ux.allowEndCall !== false} onChange={e => updateConfig('client_ux_config', { allowEndCall: e.target.checked })} className="w-4 h-4 text-indigo-500 rounded border-zinc-700 bg-zinc-900" />
          <span className="text-sm font-medium text-white">Allow client to End Call early</span>
        </label>
      </div>
    </div>
  );
};

export const AIBrainStep = ({ formData, updateConfig }) => {
  const ai = formData.ai_config || {};
  return (
    <div className={sectionClass}>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Consultant Name</label><input type="text" value={ai.assistantName || ''} onChange={e => updateConfig('ai_config', { assistantName: e.target.value })} className={inputClass} /></div>
        <div>
          <label className={labelClass}>Conversation Tone</label>
          <select value={ai.tone || 'Professional'} onChange={e => updateConfig('ai_config', { tone: e.target.value })} className={inputClass}>
            <option value="Professional">Professional & Direct</option><option value="Friendly">Friendly & Welcoming</option><option value="Technical">Highly Technical</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Agency Context & Capabilities</label>
        <p className="text-[11px] text-zinc-500 mb-2 leading-relaxed">Tell the AI what your agency does so it can steer the client appropriately.</p>
        <textarea rows="3" placeholder="We are a React & Python shop building SaaS products..." value={ai.agencyContext || ''} onChange={e => updateConfig('ai_config', { agencyContext: e.target.value })} className={`${inputClass} resize-none`} />
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