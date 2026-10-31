import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { BolnaWebCall } from "@bolna/web-call";
import { 
  WelcomeStep, ContactStep, ProjectSelectionStep, 
  NewProjectStep, MicCheckStep, ActiveCallStep, SuccessStep 
} from '../components/intake-portal/IntakeSteps';

export default function ClientIntake() {
  const [language, setLanguage] = useState('English');
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', companyName: '', projectName: '', shortDesc: '', consent: false });

  const { slug } = useParams();
  const [portal, setPortal] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [phase, setPhase] = useState('welcome'); 
  const [clientProjects, setClientProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [bolnaAgent, setBolnaAgent] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting'); 
  const [runId, setRunId] = useState(null);
  
  const [duration, setDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortal = async () => {
      const { data } = await supabase
        .from('intake_links')
        .select('*, workspaces(name)')
        .eq('url_slug', slug)
        .eq('is_active', true)
        .single();
        
      if (data) setPortal(data);
      setLoading(false);
    };
    fetchPortal();
    
    return () => stopTimer();
  }, [slug]);

  const startTimer = () => {
    setDuration(0);
    const id = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    setTimerInterval(id);
  };

  const stopTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const emailStr = formData.email.trim().toLowerCase();
    const phoneStr = formData.phone.replace(/[^0-9+]/g, '');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) return setError('Please enter a valid email address.');
    if (portal.client_ux_config?.requirePhone && phoneStr.length < 7) return setError('Please enter a valid phone number.');

    setFormData(prev => ({ ...prev, email: emailStr, phone: phoneStr }));
    setActionLoading(true);

    try {
      const { error: clientError } = await supabase
        .from('clients')
        .upsert(
          { agency_id: portal.workspace_id, email: emailStr, phone: phoneStr, full_name: formData.fullName },
          { onConflict: 'agency_id, email' } 
        );
      if (clientError) throw new Error(clientError.message || clientError.details);

      const { data: projects, error: fetchError } = await supabase
        .from('leads_prds')
        .select('id, project_summary, status, created_at, last_activity_date')
        .eq('agency_id', portal.workspace_id)
        .eq('client_email', emailStr)
        .order('last_activity_date', { ascending: false });
      if (fetchError) throw new Error(fetchError.message || fetchError.details);

      if (projects && projects.length > 0) {
        setClientProjects(projects);
        setPhase('projects');
      } else {
        setPhase('new_project');
      }
    } catch (err) {
      setError(`Database Error: ${err.message}`); 
    } finally {
      setActionLoading(false);
    }
  };

  const requestMicPermission = async () => {
    setError('');
    setActionLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); 
      startCall();
    } catch (err) {
      setActionLoading(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
         setError('Microphone access was denied. Please click the lock icon in your URL bar, allow access, and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
         setError('No microphone found. Please connect a microphone device and try again.');
      } else {
         setError('An error occurred accessing your microphone: ' + err.message);
      }
    }
  };

  const startCall = async () => {
    try {
      setCallStatus('connecting');
      setPhase('call');
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const agentId = import.meta.env.VITE_DEFAULT_BOLNA_AGENT_ID;

      const authResponse = await fetch(`${API_BASE_URL}/api/bolna/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId,
          agency_id: portal.workspace_id,
          client_email: formData.email,
          client_name: formData.fullName,
          business_name: formData.companyName || "Existing Client", 
          project_id: selectedProjectId, 
          agency_context: portal.ai_config?.agencyContext || 'Custom software agency.',
          ai_tone: portal.ai_config?.tone || 'Professional',
          important_info: portal.ai_config?.importantInfo || 'requirements.',
          client_intent: formData.shortDesc,
          language: language
        })
      });

      if (!authResponse.ok) {
        const errData = await authResponse.json();
        throw new Error(errData.detail || "Backend connection failed.");
      }
      
      const sessionData = await authResponse.json();
      const agent = new BolnaWebCall({ session: sessionData });
      
      agent.on('call-start', () => { 
        setCallStatus('active'); 
        setRunId(agent.getRunId()); 
        startTimer();
      });
      
      agent.on('call-end', () => { 
        setCallStatus('ended');
        stopTimer();
        submitToBackend(agent.getRunId()); 
      });

      await agent.start();
      setBolnaAgent(agent);
    } catch (err) {
      console.error("Session Error:", err);
      setCallStatus('failed');
      stopTimer();
      setTimeout(() => setPhase('mic'), 3000); 
    } finally {
      setActionLoading(false);
    }
  };

  const submitToBackend = async (executionId) => {
    setPhase('success');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    
    await fetch(`${API_BASE_URL}/api/leads/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: selectedProjectId,
        agency_id: portal.workspace_id,
        client_name: formData.fullName,
        client_email: formData.email,
        client_phone: formData.phone,
        company_name: formData.companyName, 
        project_name: formData.projectName || formData.shortDesc.slice(0, 30), 
        project_summary: formData.shortDesc,
        bolna_execution_id: executionId,
        call_duration: duration,
        call_status: 'completed'
      })
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]"><Loader2 className="animate-spin text-zinc-500" size={32}/></div>;
  if (!portal) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-zinc-500 font-medium">Link inactive or invalid.</div>;

  const d = portal.design_config || {};
  const bgStyle = d.backgroundStyle === 'gradient' ? { background: d.backgroundColor } 
                : d.backgroundStyle === 'grid' ? { backgroundColor: d.backgroundColor, backgroundImage: 'linear-gradient(#ffffff0a 1px, transparent 1px), linear-gradient(90deg, #ffffff0a 1px, transparent 1px)', backgroundSize: '20px 20px' }
                : { backgroundColor: d.backgroundColor };

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center p-6 transition-colors duration-700 relative overflow-hidden" style={{ ...bgStyle, color: d.textColor, fontFamily: d.font }}>
      <div className="absolute top-8 left-8 text-sm font-bold tracking-tight flex items-center gap-2 z-20">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.buttonColor }}></div> 
        {portal.agency_name || portal.workspaces?.name}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'welcome' && <WelcomeStep c={portal.content_config} d={d} onNext={() => setPhase('contact')} />}
        
        {phase === 'contact' && <ContactStep c={portal.content_config} d={d} ux={portal.client_ux_config} formData={formData} setFormData={setFormData} onSubmit={handleContactSubmit} loading={actionLoading} error={error} />}
        
        {phase === 'projects' && (
          <ProjectSelectionStep d={d} projects={clientProjects} fullName={formData.fullName} 
            onSelect={(proj) => { setSelectedProjectId(proj.id); setFormData(p => ({...p, shortDesc: proj.project_summary})); setPhase('mic'); }} 
            onNew={() => { setSelectedProjectId(null); setPhase('new_project'); }} 
          />
        )}
        
        {phase === 'new_project' && <NewProjectStep c={portal.content_config} d={d} ux={portal.client_ux_config} formData={formData} setFormData={setFormData} onSubmit={(e) => { e.preventDefault(); setPhase('mic'); }} />}
        
        {/* Passed language state to MicCheckStep */}
        {phase === 'mic' && <MicCheckStep c={portal.content_config} d={d} onStart={requestMicPermission} loading={actionLoading} error={error} language={language} setLanguage={setLanguage} />}
        
        {phase === 'call' && (
          <ActiveCallStep c={portal.content_config} d={d} ai={portal.ai_config} ux={portal.client_ux_config} callStatus={callStatus} duration={duration} isMuted={isMuted} 
            toggleMute={() => { if(bolnaAgent){ isMuted ? bolnaAgent.unmute() : bolnaAgent.mute(); setIsMuted(!isMuted); } }} 
            endCall={async () => { if (bolnaAgent) await bolnaAgent.stop(); stopTimer(); setCallStatus('ended'); submitToBackend(runId); }} 
          />
        )}
        
        {phase === 'success' && <SuccessStep c={portal.content_config} d={d} />}
      </AnimatePresence>
    </div>
  );
}