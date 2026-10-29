import { motion } from 'framer-motion';
import { Mic, FileJson, Briefcase, Zap } from 'lucide-react';

const steps = [
  { icon: Briefcase, title: "1. Create Your Agent", desc: "Design an AI architect tailored to your agency's tone and preferred tech stack." },
  { icon: Mic, title: "2. Client Speaks", desc: "Clients click your hosted widget and simply explain their app idea out loud." },
  { icon: Zap, title: "3. AI Intelligence", desc: "Archivox asks technical follow-ups and processes the transcript in real-time." },
  { icon: FileJson, title: "4. Get the Blueprint", desc: "Receive a highly structured, ready-to-sign PRD directly in your dashboard." }
];

export default function FlowSection() {
  return (
    <section id="flow" className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Scale your agency, <span className="text-blue-600">not your meetings.</span></h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">Stop wasting billable hours on non-technical founders trying to explain complex requirements. Let Voice AI handle the top of your funnel.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}