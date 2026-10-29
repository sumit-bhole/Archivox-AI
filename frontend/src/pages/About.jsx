export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">How Archivox Works</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
        Archivox replaces manual lead qualification with conversational Voice AI.
      </p>
      
      <div className="space-y-8 text-left">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">1. The Conversation</h3>
          <p className="text-slate-600 dark:text-slate-400">Prospects click the microphone on your site and explain their app idea naturally. The Bolna agent asks technical follow-ups to gather comprehensive requirements.</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">2. The Intelligence</h3>
          <p className="text-slate-600 dark:text-slate-400">Our backend processes the transcript using advanced LLMs to extract core features, user stories, and technical constraints.</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">3. The Deliverable</h3>
          <p className="text-slate-600 dark:text-slate-400">You log into your dashboard to find a highly structured Product Requirements Document, complete with a tech stack recommendation and hour estimates.</p>
        </div>
      </div>
    </div>
  );
}