import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="hero" className="pt-32 pb-20 px-6 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold border border-blue-200 dark:border-blue-800/50">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Automate Pre-Sales Discovery
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            The Voice-Native <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500">Architect</span> for Dev Teams
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
            Deploy a custom AI agent to talk to your prospects in real-time. Archivox instantly turns natural voice conversations into technical Product Requirements Documents (PRDs).
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-1">
              Build Your Agent
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-3xl blur-3xl opacity-20 dark:opacity-40 animate-pulse"></div>
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
            alt="Dashboard Visualization" 
            className="relative rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 object-cover w-full h-[500px]"
          />
          
          {/* Floating UI Element Animation */}
          <motion.div 
            animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-2xl">🎙️</div>
              <div>
                <p className="font-bold">PRD Generated</p>
                <p className="text-sm text-slate-500">React + FastAPI Architecture</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}