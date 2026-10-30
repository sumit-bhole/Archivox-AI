import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Loader2, Mic, MicOff, PhoneOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BolnaWebCall } from "@bolna/web-call";

export default function ClientIntake() {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 'welcome' -> 'form' -> 'call' -> 'success'
  const [phase, setPhase] = useState('welcome');

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', businessName: '', businessType: '', shortDesc: '', consent: false
  });

  const [bolnaAgent, setBolnaAgent] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting');
  const [runId, setRunId] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add('dark'); // Force strict monochrome
    const fetchWorkspace = async () => {
      const { data } = await supabase.from('workspaces').select('*');
      if (data) {
        const matchedWs = data.find(w => w.url_slug === slug || w.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
        if (matchedWs) setWorkspace(matchedWs);
      }
      setLoading(false);
    };
    fetchWorkspace();
  }, [slug]);

  const startCall = async () => {
    try {
      setCallStatus('connecting');
      setPhase('call');
      setRunId(null);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const agentId = import.meta.env.VITE_DEFAULT_BOLNA_AGENT_ID;

      const authResponse = await fetch(`${API_BASE_URL}/api/bolna/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId,
          client_name: formData.fullName,
          business_name: formData.businessName,
          business_type: formData.businessType,
          short_desc: formData.shortDesc
        })
      });

      if (!authResponse.ok) throw new Error("Connection failed.");
      const sessionData = await authResponse.json();

      const agent = new BolnaWebCall({ session: sessionData });

      agent.on('call-start', () => {
        setCallStatus('active');
        setRunId(agent.getRunId());
      });

      agent.on('call-end', () => {
        setCallStatus('ended');
        submitToBackend(agent.getRunId());
      });

      await agent.start();
      setBolnaAgent(agent);

    } catch (err) {
      console.error(err);
      alert("Error starting voice connection. Please allow microphone access.");
      setPhase('form');
    }
  };

  const endCall = async () => {
    if (bolnaAgent) await bolnaAgent.stop(); 
    setCallStatus('ended');
    submitToBackend(runId);
  };

  const submitToBackend = async (executionId) => {
    try {
      setPhase('success'); // Show immediate feedback while processing background
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      await fetch(`${API_BASE_URL}/api/leads/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency_id: workspace.id,
          client_name: formData.fullName,
          client_email: formData.email,
          company_name: formData.businessName,
          project_summary: formData.shortDesc || `${formData.businessType} requiring custom software.`,
          core_features: "Extracted via AI.",
          bolna_execution_id: executionId
        })
      });
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#000000]"><Loader2 className="animate-spin text-zinc-500" size={32}/></div>;
  if (!workspace) return <div className="min-h-screen flex items-center justify-center text-sm font-medium bg-[#000000] text-zinc-400">404 - Discovery Portal Not Found</div>;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-zinc-800">
      
      {/* Top Left Branding */}
      <div className="absolute top-6 left-6 text-sm font-semibold tracking-tight text-white flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full"></div> {workspace.name}
      </div>

      <AnimatePresence mode="wait">
        
        {/* PHASE 1: WELCOME SCREEN */}
        {phase === 'welcome' && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md w-full text-center">
            <h1 className="text-3xl font-semibold mb-3 tracking-tight">Let's understand your business.</h1>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">Instead of filling out long technical forms, have a simple 5-10 minute conversation with our AI consultant about what your business needs.</p>
            
            <div className="bg-[#0A0A0A] border border-zinc-900 rounded-2xl p-6 text-left space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                <p className="text-sm text-zinc-300">Speak naturally in your own words.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                <p className="text-sm text-zinc-300">Focus on business goals, not technical details.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                <p className="text-sm text-zinc-300">We automatically draft your project blueprint.</p>
              </div>
            </div>

            <button onClick={() => setPhase('form')} className="w-full bg-white text-black font-medium py-3.5 rounded-xl hover:bg-zinc-200 transition-colors">
              Start Discovery
            </button>
          </motion.div>
        )}

        {/* PHASE 2: CLIENT DETAILS FORM */}
        {phase === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">Just a few details</h2>
            <form onSubmit={(e) => { e.preventDefault(); startCall(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                  <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-3 bg-[#0A0A0A] border border-zinc-800 rounded-xl outline-none focus:border-zinc-500 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-[#0A0A0A] border border-zinc-800 rounded-xl outline-none focus:border-zinc-500 text-sm" required />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-[#0A0A0A] border border-zinc-800 rounded-xl outline-none focus:border-zinc-500 text-sm" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Business Name</label>
                  <input type="text" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full p-3 bg-[#0A0A0A] border border-zinc-800 rounded-xl outline-none focus:border-zinc-500 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Business Type</label>
                  <select value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})} className="w-full p-3 bg-[#0A0A0A] border border-zinc-800 rounded-xl outline-none focus:border-zinc-500 text-sm appearance-none" required>
                    <option value="" disabled>Select Type...</option>
                    <option value="E-commerce">E-commerce / Retail</option>
                    <option value="Restaurant">Restaurant / Food</option>
                    <option value="Service">Service / Consulting</option>
                    <option value="Tech">Technology / Startup</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">What do you want to build? (Short summary)</label>
                <textarea rows="2" value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} className="w-full p-3 bg-[#0A0A0A] border border-zinc-800 rounded-xl outline-none focus:border-zinc-500 text-sm resize-none" required></textarea>
              </div>

              <div className="flex items-start gap-3 mt-4 mb-2">
                <input type="checkbox" id="consent" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} className="mt-1" required />
                <label htmlFor="consent" className="text-[11px] text-zinc-500 leading-tight">I consent to this conversation being processed by AI to generate project requirements. Data is securely transmitted and processed.</label>
              </div>

              <button type="submit" disabled={!formData.consent} className="w-full bg-white text-black font-medium py-3.5 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-2">
                Connect to Consultant
              </button>
            </form>
          </motion.div>
        )}

        {/* PHASE 3: ACTIVE CALL (MINIMALIST) */}
        {phase === 'call' && (
          <motion.div key="call" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full flex flex-col items-center text-center">
            
            <div className="relative flex items-center justify-center w-48 h-48 mb-12">
               {callStatus === 'active' && (
                 <>
                   <div className="absolute inset-0 rounded-full border border-white opacity-20 animate-ping" style={{ animationDuration: '2s' }}></div>
                   <div className="absolute inset-4 rounded-full border border-white opacity-40 animate-ping" style={{ animationDuration: '2.5s' }}></div>
                 </>
               )}
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                 <Mic size={32} className="text-black" />
               </div>
            </div>

            <h2 className="text-2xl font-semibold mb-2">{workspace.agent_name || 'Business Consultant'}</h2>
            <p className="text-sm text-zinc-400 mb-12 h-6">
              {callStatus === 'connecting' ? 'Establishing secure connection...' : 'Listening... Speak naturally.'}
            </p>

            <div className="flex items-center gap-6">
              <button onClick={() => { if(bolnaAgent){ isMuted ? bolnaAgent.unmute() : bolnaAgent.mute(); setIsMuted(!isMuted); } }} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-zinc-200 text-black' : 'bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800'}`}>
                {isMuted ? <MicOff size={24}/> : <Mic size={24}/>}
              </button>
              <button onClick={endCall} className="w-14 h-14 rounded-full flex items-center justify-center bg-white text-black hover:bg-zinc-200 transition-colors">
                <PhoneOff size={24}/>
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE 4: SUCCESS */}
        {phase === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center p-8 bg-[#0A0A0A] border border-zinc-900 rounded-3xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-black">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-semibold mb-3 tracking-tight">Conversation Received</h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">Thank you for your time, {formData.fullName.split(' ')[0]}. The engineering team at {workspace.name} is reviewing your context to draft your technical blueprint. You can now close this tab.</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}