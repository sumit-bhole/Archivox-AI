import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        >
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
            alt="Team Collaboration" 
            className="rounded-3xl shadow-2xl object-cover h-[450px] w-full"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold">Built by developers, <br/>for developers.</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            We understand the exact friction of freelance software development. You want to write code, build scalable systems, and ship products—not spend 10 hours a week extracting technical requirements from vague client ideas.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Archivox acts as the perfect buffer. We use advanced LLMs and ultra-low latency voice models to interview your clients with the precision of a Senior Architect, giving you structured data from day one.
          </p>
          <ul className="space-y-4 pt-4">
            <li className="flex items-center gap-3 font-semibold">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span> 100% White-labeled for your agency
            </li>
            <li className="flex items-center gap-3 font-semibold">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span> Outputs strict JSON architecture formats
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}