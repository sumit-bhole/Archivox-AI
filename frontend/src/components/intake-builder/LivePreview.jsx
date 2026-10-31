import { useState } from 'react';
import { Mic, MicOff, PhoneOff, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LivePreview({ formData, mode }) {
  const [phase, setPhase] = useState('welcome'); // 'welcome', 'form', 'call'
  
  const d = formData.design_config || {};
  const c = formData.content_config || {};
  const ai = formData.ai_config || {};
  const ux = formData.client_ux_config || {};

  const borderRadius = d.buttonStyle === 'pill' ? '999px' : d.buttonStyle === 'rounded' ? '12px' : '0px';

  // Helper to generate the background based on selected theme style
  const bgStyle = d.backgroundStyle === 'gradient' ? { background: d.backgroundColor } 
                : d.backgroundStyle === 'grid' ? { backgroundColor: d.backgroundColor, backgroundImage: 'linear-gradient(#ffffff0a 1px, transparent 1px), linear-gradient(90deg, #ffffff0a 1px, transparent 1px)', backgroundSize: '20px 20px' }
                : { backgroundColor: d.backgroundColor };

  return (
    <div className="h-full w-full bg-zinc-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      <div className={`transition-all duration-500 shadow-2xl overflow-hidden relative flex flex-col ${mode === 'mobile' ? 'w-[375px] h-[812px] rounded-[3rem] border-[10px] border-zinc-900' : 'w-full h-full rounded-2xl border border-zinc-800'}`} style={{ ...bgStyle, color: d.textColor, fontFamily: d.font }}>
        
        <div className="absolute top-6 left-6 text-xs font-bold tracking-tight flex items-center gap-2 z-10">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.buttonColor }}></div> 
          {formData.agency_name || "Agency Name"}
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8">
          <AnimatePresence mode="wait">
            
            {/* WELCOME */}
            {phase === 'welcome' && (
              <motion.div key="welcome" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center w-full max-w-md">
                <h1 className="text-3xl font-bold mb-4 tracking-tight leading-tight">{c.heading}</h1>
                <p className="opacity-80 mb-10 text-sm leading-relaxed">{c.subtitle}</p>
                <button onClick={() => setPhase('form')} className="w-full py-4 font-bold shadow-lg text-sm transition-transform hover:scale-[1.02]" style={{ backgroundColor: d.buttonColor, color: '#fff', borderRadius }}>
                  {c.startBtn}
                </button>
              </motion.div>
            )}

            {/* FORM */}
            {phase === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-md">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold mb-4 tracking-tight">Your Details</h2>
                  <div className="space-y-3">
                    <input type="text" placeholder={c.nameLabel} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-sm outline-none" readOnly />
                    <input type="email" placeholder={c.emailLabel} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-sm outline-none" readOnly />
                    {ux.requirePhone !== false && <input type="tel" placeholder={c.phoneLabel} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-sm outline-none" readOnly />}
                    {ux.requireCompany !== false && <input type="text" placeholder="Company Name" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-sm outline-none" readOnly />}
                    <textarea rows="2" placeholder="Briefly, what are you trying to build?" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-sm outline-none resize-none" readOnly></textarea>
                    
                    <button onClick={() => setPhase('call')} className="w-full py-3.5 font-bold mt-2 shadow-lg text-sm transition-transform hover:scale-[1.02]" style={{ backgroundColor: d.buttonColor, color: '#fff', borderRadius }}>
                      Connect Microphone
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CALL */}
            {phase === 'call' && (
              <motion.div key="call" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center flex flex-col items-center">
                <div className="relative flex items-center justify-center w-40 h-40 mb-8">
                  <div className="absolute inset-0 rounded-full opacity-20 animate-ping" style={{ backgroundColor: d.buttonColor }}></div>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl z-10" style={{ backgroundColor: d.buttonColor }}>
                    <Mic size={28} color="#ffffff" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 tracking-tight">{c.welcomeHeading || ai.assistantName}</h2>
                <p className="opacity-80 mb-12 text-sm">{c.welcomeMessage}</p>
                <div className="flex items-center gap-6">
                  {ux.allowMute !== false && (
                    <button className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/10 transition-colors">
                      <Mic size={18} />
                    </button>
                  )}
                  {ux.allowEndCall !== false && (
                    <button onClick={() => setPhase('welcome')} className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors">
                      <PhoneOff size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}