import { Loader2, Mic, MicOff, PhoneOff, CheckCircle2, Lock, ArrowRight, ShieldCheck, Plus, FileText, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const animProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const WelcomeStep = ({ c, d, onNext }) => {
  const borderRadius = d.buttonStyle === 'pill' ? '999px' : d.buttonStyle === 'rounded' ? '12px' : '0px';
  return (
    <motion.div {...animProps} className="max-w-xl w-full text-center z-10">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{c.heading}</h1>
      <p className="text-lg opacity-80 mb-10 leading-relaxed font-medium">{c.subtitle}</p>
      <button onClick={onNext} style={{ backgroundColor: d.buttonColor, color: '#ffffff', borderRadius }} className="w-full md:w-auto px-12 font-bold py-4 shadow-xl hover:scale-105 transition-transform">
        {c.startBtn}
      </button>
    </motion.div>
  );
};

export const ContactStep = ({ c, d, ux, formData, setFormData, onSubmit, loading, error }) => {
  const borderRadius = d.buttonStyle === 'pill' ? '999px' : d.buttonStyle === 'rounded' ? '12px' : '0px';
  const inputClass = "w-full p-4 bg-black/40 border border-white/10 rounded-xl outline-none font-medium placeholder:opacity-40 focus:border-white/30 transition-colors";
  
  return (
    <motion.div {...animProps} className="max-w-md w-full z-10">
      <div className="bg-black/20 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-2 tracking-tight">Let's verify your identity</h2>
        <p className="text-sm opacity-70 mb-6">Enter your details to access your secure portal.</p>
        
        {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl flex items-start gap-2"><AlertCircle size={18} className="shrink-0 mt-0.5"/> {error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" placeholder={c.nameLabel} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className={inputClass} required />
          <input type="email" placeholder={c.emailLabel} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} required />
          {ux.requirePhone !== false && (
            <input type="tel" placeholder={c.phoneLabel || "Phone Number (e.g. +1234567890)"} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} required={ux.requirePhone !== false} />
          )}
          
          <button type="submit" disabled={loading} style={{ backgroundColor: d.buttonColor, color: '#ffffff', borderRadius }} className="w-full font-bold py-4 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-50 mt-2 shadow-lg">
            {loading ? <Loader2 size={18} className="animate-spin"/> : <>Continue <ArrowRight size={18}/></>}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export const ProjectSelectionStep = ({ d, projects, fullName, onSelect, onNew }) => (
  <motion.div {...animProps} className="max-w-2xl w-full z-10">
    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {fullName.split(' ')[0]}</h2>
        <p className="opacity-70">Select an existing project or start a new discovery session.</p>
      </div>
      <button onClick={onNew} className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold transition-colors backdrop-blur-sm w-fit">
        <Plus size={16} /> New Project
      </button>
    </div>

    <div className="grid gap-4">
      {projects.map(proj => (
        <button key={proj.id} onClick={() => onSelect(proj)} className="text-left w-full p-6 rounded-2xl bg-black/20 border border-white/10 hover:border-white/30 hover:bg-black/30 transition-all backdrop-blur-sm group flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText size={18} style={{ color: d.buttonColor }} />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 opacity-70">
                {proj.status === 'approved' ? 'Approved' : 'In Progress'}
              </span>
            </div>
            <p className="font-semibold text-lg line-clamp-1">{proj.project_summary || 'Untitled Project'}</p>
            <p className="text-xs opacity-50 mt-1">Last activity: {new Date(proj.last_activity_date || proj.created_at).toLocaleDateString()}</p>
          </div>
          <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
        </button>
      ))}
    </div>
  </motion.div>
);
// New Project Step (Added Project Name input)
export const NewProjectStep = ({ c, d, ux, formData, setFormData, onSubmit }) => {
  const borderRadius = d.buttonStyle === 'pill' ? '999px' : d.buttonStyle === 'rounded' ? '12px' : '0px';
  const inputClass = "w-full p-4 bg-black/40 border border-white/10 rounded-xl outline-none font-medium placeholder:opacity-40 focus:border-white/30 transition-colors";
  return (
    <motion.div {...animProps} className="max-w-md w-full z-10">
      <div className="bg-black/20 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-2 tracking-tight">New Project</h2>
        <p className="text-sm opacity-70 mb-6">Briefly outline what you want to build.</p>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" placeholder="Project Name" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} className={inputClass} required />
          <textarea rows="3" placeholder="Short Description..." value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} className={`${inputClass} resize-none`} required></textarea>
          
          <div className="flex items-start gap-3 mt-4 mb-2">
            <input type="checkbox" id="consent" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} className="mt-1 shrink-0" required />
            <label htmlFor="consent" className="text-xs opacity-70 flex gap-1"><Lock size={14} className="shrink-0"/> {c.privacyNotice}</label>
          </div>
          <button type="submit" disabled={!formData.consent} style={{ backgroundColor: d.buttonColor, color: '#ffffff', borderRadius }} className="w-full font-bold py-4 transition-transform hover:scale-[1.02] disabled:opacity-50">Next Step</button>
        </form>
      </div>
    </motion.div>
  );
};
// Mic Check Step (Added Language Selection)
export const MicCheckStep = ({ c, d, onStart, loading, error, language, setLanguage }) => {
  const borderRadius = d.buttonStyle === 'pill' ? '999px' : d.buttonStyle === 'rounded' ? '12px' : '0px';
  return (
    <motion.div {...animProps} className="max-w-md w-full text-center p-8 bg-black/20 border border-white/10 rounded-3xl backdrop-blur-md z-10">
      <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-black/40 text-white"><Mic size={32} /></div>
      <h2 className="text-2xl font-bold mb-3 tracking-tight">Audio Settings</h2>
      
      <div className="mb-6 text-left">
        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Select Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl outline-none font-medium text-white appearance-none cursor-pointer">
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Hinglish">Hinglish</option>
          <option value="Marathi">Marathi</option>
        </select>
      </div>

      {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl text-left flex items-start gap-3"><AlertCircle size={20} className="shrink-0 mt-0.5" /><p>{error}</p></div>}

      <button onClick={onStart} disabled={loading} style={{ backgroundColor: d.buttonColor, color: '#ffffff', borderRadius }} className="w-full font-bold py-4 transition-transform hover:scale-[1.02] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <Loader2 size={18} className="animate-spin"/> : 'Allow Microphone & Start'}
      </button>
    </motion.div>
  );
};

export const ActiveCallStep = ({ c, d, ai, ux, callStatus, isMuted, toggleMute, endCall, duration }) => {
  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <motion.div {...animProps} className="max-w-md w-full flex flex-col items-center text-center z-10">
      <div className="relative flex items-center justify-center w-56 h-56 mb-10">
         {callStatus === 'active' && (
           <>
             <div className="absolute inset-0 rounded-full opacity-20 animate-ping" style={{ animationDuration: '2s', backgroundColor: d.buttonColor }}></div>
             <div className="absolute inset-4 rounded-full opacity-40 animate-ping" style={{ animationDuration: '2.5s', backgroundColor: d.buttonColor }}></div>
           </>
         )}
         <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl z-10 relative overflow-hidden" style={{ backgroundColor: d.buttonColor }}>
           <Mic size={32} color="#ffffff" className="mb-1" />
           {callStatus === 'active' && (
             <span className="text-white/90 text-[10px] font-bold tracking-widest">{formatTime(duration)}</span>
           )}
         </div>
      </div>
      
      <h2 className="text-3xl font-bold mb-3 tracking-tight">{c.welcomeHeading || ai.assistantName}</h2>
      
      <p className="opacity-80 mb-12 font-medium text-base max-w-sm h-12 flex items-center justify-center">
        {callStatus === 'connecting' ? 'Establishing secure connection...' : 
         callStatus === 'failed' ? 'Connection failed. Please try again.' : 
         (c.welcomeMessage || 'Listening... Speak naturally.')}
      </p>
      
      <div className="flex items-center gap-8">
        {ux.allowMute !== false && (
          <button onClick={toggleMute} disabled={callStatus !== 'active'} className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors border ${isMuted ? 'bg-amber-500 text-white border-amber-500' : 'border-white/20 bg-black/20 hover:bg-black/40'} disabled:opacity-50`}>
            {isMuted ? <MicOff size={24}/> : <Mic size={24}/>}
          </button>
        )}
        {ux.allowEndCall !== false && (
          <button onClick={endCall} className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors border-red-500">
            <PhoneOff size={24}/>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const SuccessStep = ({ c, d }) => (
  <motion.div {...animProps} className="max-w-md w-full text-center p-12 bg-black/20 border border-white/10 rounded-3xl backdrop-blur-md z-10">
    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-lg" style={{ backgroundColor: d.buttonColor }}>
      <CheckCircle2 size={40} />
    </div>
    <h2 className="text-3xl font-bold mb-4 tracking-tight">{c.completionHeading}</h2>
    <p className="opacity-80 leading-relaxed font-medium">{c.completionMessage}</p>
  </motion.div>
);