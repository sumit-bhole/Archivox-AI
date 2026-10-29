import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "How fast is the voice AI?", a: "Archivox uses ultra-low latency WebRTC models. The response time is typically under 800ms, making it feel like a natural human conversation." },
  { q: "Can it recommend my specific tech stack?", a: "Yes. When you build your agent, you define your agency's preferred technologies (e.g., FastAPI, React). The AI will structure the PRD around those constraints." },
  { q: "How do I integrate this on my website?", a: "We provide a unique hosted URL for your agency (e.g., archivox.ai/talk/your-agency). You simply link any button on your portfolio to this page." },
  { q: "What happens if a client asks for something impossible?", a: "The AI acts as a technical gatekeeper. It will politely inform the client of technical limitations and log the request as a 'Red Flag' in your final PRD dashboard." }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-900/50 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left font-bold flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                {faq.q}
                <ChevronDown className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}