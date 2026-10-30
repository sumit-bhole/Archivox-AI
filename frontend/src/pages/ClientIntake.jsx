import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Loader2, Mic, MicOff, PhoneOff, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BolnaWebCall } from "@bolna/web-call";

export default function ClientIntake() {
  const { slug } = useParams();
  const [portal, setPortal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('welcome');
  
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', businessName: '', shortDesc: '', consent: false });
  const [bolnaAgent, setBolnaAgent] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting');
  const [runId, setRunId] = useState(null);

  useEffect(() => {
    const fetchPortal = async () => {
      // Unauthenticated, public read request to the new architecture
      const { data, error } = await supabase
        .from('intake_links')
        .select('*, workspaces(name)')
        .eq('url_slug', slug)
        .eq('is_active', true)
        .single();
        
      if (data) setPortal(data);
      setLoading(false);
    };
    fetchPortal();
  }, [slug]);

  const startCall = async () => {
    try {
      setCallStatus('connecting');
      setPhase('call');
      
      // Explicitly enforce microphone permissions
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const agentId = import.meta.env.VITE_DEFAULT_BOLNA_AGENT_ID;

      // Inject the AI configuration (Agency Context) into the session description
      const enhancedContext = `
        CLIENT CONTEXT: 
        Wants to build: ${formData.shortDesc}
        
        AGENCY CAPABILITIES: 
        ${portal.ai_config?.agencyContext || 'Custom software development agency.'}
        
        INSTRUCTIONS FOR AI:
        Tone: ${portal.ai_config?.tone || 'Professional'}
        Important Info to Collect: ${portal.ai_config?.importantInfo || 'Budget, timeline, core features.'}
      `;

      const authResponse = await fetch(`${API_BASE_URL}/api/bolna/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId,
          client_name: formData.fullName,
          business_name: formData.businessName,
          business_type: portal.project_category || "Business",
          short_desc: enhancedContext
        })
      });

      if (!authResponse.ok) throw new Error("Connection failed.");
      const sessionData = await authResponse.json();

      const agent = new BolnaWebCall({ session: sessionData });

      agent.on('call-start', () => { setCallStatus('active'); setRunId(agent.getRunId()); });
      agent.on('call-end', () => { setCallStatus('ended'); submitToBackend(agent.getRunId()); });

      await agent.start();
      setBolnaAgent(agent);
    } catch (err) {
      alert("Microphone access is required to start the voice discovery. Please allow permissions in your browser.");
      setPhase('form');
    }
  };

  const endCall = async () => {
    if (bolnaAgent) await bolnaAgent.stop(); 
    setCallStatus('ended');
    submitToBackend(runId);
  };

  const submitToBackend = async (executionId) => {
    setPhase('success');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    await fetch(`${API_BASE_URL}/api/leads/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agency_id: portal.workspace_id,
        client_name: formData.fullName,
        client_email: formData.email,
        company_name: formData.businessName,
        project_summary: formData.shortDesc,
        core_features: "Extracted via AI Voice Agent.",
        bolna_execution_id: executionId
      })
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-zinc-400" size={32}/></div>;
  if (!portal) return <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-500 font-medium">404 - This discovery link is invalid or inactive.</div>;

  // Extract dynamic configurations with fallbacks
  const d = portal.design_config || {};
  const c = portal.content_config || {};
  const ai = portal.ai_config || {};

  const borderRadiusClass = d.buttonStyle === 'pill' ? 'rounded-full' : d.buttonStyle === 'square' ? 'rounded-none' : 'rounded-xl';

  return (
    <div 
      className="min-h-screen font-sans flex flex-col items-center justify-center p-6 transition-colors duration-700" 
      style={{ backgroundColor: d.backgroundColor, color: d.textColor, fontFamily: d.font }}
    >
      
      <div className="absolute top-8 left-8 text-sm font-bold tracking-tight flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.buttonColor }}></div> 
        {portal.agency_name || portal.workspaces?.name}
      </div>

      <AnimatePresence mode="wait">
        
        {/* PHASE 1: WELCOME SCREEN */}
        {phase === 'welcome' && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-xl w-full text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{c.heading}</h1>
            <p className="text-lg opacity-80 mb-10 leading-relaxed font-medium">{c.subtitle}</p>
            <button 
              onClick={() => setPhase('form')} 
              style={{ backgroundColor: d.buttonColor, color: '#ffffff' }} 
              className={`w-full md:w-auto px-12 font-bold py-4 shadow-xl hover:opacity-90 transition-opacity ${borderRadiusClass}`}
            >
              {c.startBtn}
            </button>
          </motion.div>
        )}

        {/* PHASE 2: CLIENT DETAILS FORM */}
        {phase === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-lg w-full">
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 tracking-tight">Your Details</h2>
              <form onSubmit={(e) => { e.preventDefault(); startCall(); }} className="space-y-4">
                <div><input type="text" placeholder={c.nameLabel} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-xl outline-none font-medium placeholder:opacity-50" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="email" placeholder={c.emailLabel} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-xl outline-none font-medium placeholder:opacity-50" required />
                  <input type="tel" placeholder={c.phoneLabel} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-xl outline-none font-medium placeholder:opacity-50" />
                </div>
                <div><input type="text" placeholder="Business / Organization Name" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-xl outline-none font-medium placeholder:opacity-50" required /></div>
                <div><textarea rows="2" placeholder="Briefly, what are you trying to build?" value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} className="w-full p-4 bg-transparent border border-black/20 dark:border-white/20 rounded-xl outline-none font-medium resize-none placeholder:opacity-50" required></textarea></div>
                
                <div className="flex items-start gap-3 mt-6 mb-2">
                  <input type="checkbox" id="consent" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} className="mt-1" required />
                  <label htmlFor="consent" className="text-xs opacity-70 leading-relaxed flex gap-1"><Lock size={14}/> {c.privacyNotice}</label>
                </div>
                <button type="submit" disabled={!formData.consent} style={{ backgroundColor: d.buttonColor, color: '#ffffff' }} className={`w-full font-bold py-4 transition-all hover:opacity-90 disabled:opacity-50 mt-2 shadow-lg ${borderRadiusClass}`}>
                  Connect Microphone
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* PHASE 3: ACTIVE CALL */}
        {phase === 'call' && (
          <motion.div key="call" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center w-56 h-56 mb-12">
               {callStatus === 'active' && (
                 <>
                   <div className="absolute inset-0 rounded-full opacity-20 animate-ping" style={{ animationDuration: '2s', backgroundColor: d.buttonColor }}></div>
                   <div className="absolute inset-4 rounded-full opacity-40 animate-ping" style={{ animationDuration: '2.5s', backgroundColor: d.buttonColor }}></div>
                 </>
               )}
               <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl z-10" style={{ backgroundColor: d.buttonColor }}>
                 <Mic size={40} color="#ffffff" />
               </div>
            </div>

            <h2 className="text-3xl font-bold mb-3 tracking-tight">{c.welcomeHeading || ai.assistantName}</h2>
            <p className="opacity-80 mb-16 font-medium text-lg max-w-sm">
              {callStatus === 'connecting' ? 'Establishing secure WebRTC connection...' : (c.welcomeMessage || 'Listening... Speak naturally.')}
            </p>

            <div className="flex items-center gap-8">
              <button onClick={() => { if(bolnaAgent){ isMuted ? bolnaAgent.unmute() : bolnaAgent.mute(); setIsMuted(!isMuted); } }} className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors border border-black/20 dark:border-white/20 ${isMuted ? 'bg-amber-500 text-white border-amber-500' : 'hover:opacity-80'}`}>
                {isMuted ? <MicOff size={24}/> : <Mic size={24}/>}
              </button>
              <button onClick={endCall} className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors border-red-500">
                <PhoneOff size={24}/>
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE 4: SUCCESS */}
        {phase === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center p-12 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl backdrop-blur-sm">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-lg" style={{ backgroundColor: d.buttonColor }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">{c.completionHeading}</h2>
            <p className="opacity-80 leading-relaxed font-medium">{c.completionMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}